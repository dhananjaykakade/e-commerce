const express = require("express");

const dbconnect = require("./config/dbconnect")

const path = require("path");

const dotenv = require('dotenv');

dotenv.config({path:"./config/config.env"});

const bodyParser = require('body-parser');

const app =express();

app.use(express.json());

const static_path = path.join(__dirname,"./public")

app.use(express.static(static_path))

app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));

const Login = require("./database/register");

const Product = require("./database/product");

const { Console } = require("console");

const { name } = require("ejs");

// const upload = require('./uplaods/multer');

// const cloudinary = require('./cloud/cloudnary');

const fs = require('fs');
// *********************************************************************************
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
    // Temporary folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// *****************************************************************************************

// **************************start server
dbconnect();


app.listen(process.env.PORT,() => {
  console.log(`server is started at port ${process.env.PORT}`)
})



// ************************************cloudinary config





// templates*****************


app.get("/home",(req,res) => {
  res.render("index");
});

app.post("/home",(req,res) => {
  res.render("index");
});

app.get("/register",(req,res) => {
  res.render("login");
});
app.get("/Login",(req,res) => {
  res.render("login2");
});

app.get("/admin/profile",(req,res) => {
  res.render("admin");
});
app.get("/add-product",(req,res) => {
  res.render("edit");
});
// *********************************************************manage
app.get("/admin/profile/manage",async(req,res) => {
  try {
    const products = await Product.find().sort({ name: 1 }); 
    res.render('pmanage', { products }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});
// *********************************************************manage

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    const categories = [...new Set(products.map(product => product.category))].map(category => ({ name: category }));
    res.render('shop', { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});


app.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    res.render('product', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching product details');
  }
});






// routes************************************************
app.post("/register",async(req,res) => {
  try {
    const loginid = new Login({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    })
    

    const logindb = await loginid.save();
    res.redirect("/home");

  } catch (error) {
    res.status(400).send(error);
  }

  
  
});
// login 

app.post("/Login", async (req,res) => {
  try {
    const email = req.body.log_email;
    const pass = req.body.log_password;


     console.log(`${email} and ${pass}`)

     const user = await Login.findOne({email:email});
     if (user.password===pass) {
        res.redirect("home")
     }
     
    //   if ( pass==="aaaa") {
    //   res.render("admin")
    //  }
     
     else{
      res.send("incorrect password")
     }
  } catch (error) {
    res.status(400).send(error)
  }
});


// **************************************to upload a products
// app.use('/admin/products',upload.array('image'),async (req,res) => {
//   const uploader = async (path) => await cloudinary.uploads(path,'images')

//   if (req.method==='POST') {
//     const urls= []
//     const files1 = req.files
//     for(const file of files1)
//     {
//       const {path}=file 
//       const newpath = await uploader(path);
//       urls.push(newpath);
//       fs.unlinkSync(path);


//     }

//     res.status(200).json({
//       message:'successful',
//       data:urls
//     })
//   }else{
//     res.status(405).json({
//       err:'failed',
      
//     })
//   }

// })



app.post('/add-product',upload.array('images[]', 3), async (req, res) => {
  console.log(req.body); // Debug: Check the content of req.body
   console.log(req.files);
  try {
    const imageUploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'product_images' // Customize the folder structure
      })
    );

    const uploadedResults = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedResults.map(result => result.secure_url);

    const newProduct = new Product({
      name: req.body.name,
      details: req.body.details,
      price: req.body.price,
      offer_price: req.body.offer_price,
      discount: req.body.discount,
      imageUrls: imageUrls,
      category: req.body.category,
    });

    await newProduct.save();

    // Clean up the temporary uploaded files
    req.files.forEach(file => fs.unlinkSync(file.path));

    res.redirect('/add-product');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading product');
  }
});






