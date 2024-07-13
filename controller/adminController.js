const Product = require("../database/product")
const Login = require("../database/register")
const payment = require("../database/payment")
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.getAdmin= (req, res) => {
    res.render("admin/admin");
  };

  
  exports.getAddProduct=(req, res) => {
    res.render("admin/edit");
  };

  exports.productManage= async (req,res) => {
    try {
      const products = await Product.find().sort({ name: 1 });
      res.render("admin/pmanage", { products });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching products");
    }
  }



  
  exports.getManageUser = async (req,res) => {
    try {
      const user = await Login.find().sort({ name: 1 });
      res.render("admin/usermanage", { user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching products");
    }
  }

  exports.updateRole = async (req,res) => {
    const userId = req.params.Id;
    const { newRole } = req.body;
  
    try {
      // Find the user by ID in the database
      const user = await Login.findByIdAndUpdate(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update the user's role
      if (newRole) {
        user.userRole = newRole;
      }
      await user.save();
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user role" });
    }
  }

  exports.updateUser = async (req,res) => {
    const userRoles = req.body.userRoles;
  
    try {
      // Loop through the user roles and update each user's role
      for (const userId in userRoles) {
        const newRole = userRoles[userId];
        await User.findByIdAndUpdate(userId, { userRole: newRole });
      }
  
      res.redirect("/admin/manage-user"); // Redirect to the user list page after updating roles
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user roles" });
    }
  }

  exports.postAddProduct= async (req,res) => {
    try {
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "product_images", // Customize the folder structure
        })
      );
  
      const uploadedResults = await Promise.all(imageUploadPromises);
      const imageUrls = uploadedResults.map((result) => result.secure_url);

  const Price = Math.floor( req.body.offer_price - (req.body.offer_price * (req.body.discount/100))); 
      const newProduct = new Product({
        name: req.body.name,
        details: req.body.details,
        price:Price,
        offer_price: req.body.offer_price,
        discount: req.body.discount,
        imageUrls: imageUrls,
        category: req.body.category,
      });
  
      await newProduct.save();
  
      // Clean up the temporary uploaded files
      req.files.forEach((file) => fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      }));
  
      res.redirect("/admin/add-product");
    } catch (error) {
      console.error(error);
      console.log(error);
      res.status(500).send("Error uploading product");
    }
  }

  exports.getUserCount = async (req,res) => {
    try {
      const user = await Login.find().sort({ createdAt: -1 }).limit(10);
    
      const UserCount = await Login.countDocuments();
      res.json({ UserCount }).status(200);

    } catch (error) {
      res.json({message:"Error getting user count"}).status(404)
    }
  }

exports.getProductSale = async (req,res) => {
  try {
    const result = await payment.aggregate([
      { $unwind: "$payments" }, // Unwind the payments array to treat each payment as a separate document
      { $count: "totalPayments" } // Count the total number of payments
    ]);
    console.log(result);

    const totalPaymentsCount = result.length > 0 ? result[0].totalPayments : 0;
  
    
    return res.json({totalPaymentsCount}).status(200);

  } catch (error) {
    res.status(404).send("Error getting product");
  }
}
exports.getTotalSale = async (req,res) => {
  try {
    const payments = await payment.aggregate([
      { $unwind: "$payments" }, // Unwind the payments array to treat each payment as a separate document
      { $project: { amount: { $toInt: "$payments.amount" } } } // Project the amount as an integer
    ]);

    const totalSales = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    console.log("Total sales:", totalSales);
    return res.json({totalSales}).status(200); 
  } catch (error) {
    
    res.status(404).send("Error getting total sales");
    
  }

  
}