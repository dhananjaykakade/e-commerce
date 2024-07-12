const express = require("express");

const dbconnect = require("./config/dbconnect");

const path = require("path");

const passport = require("passport");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const bodyParser = require("body-parser");

const app = express();

app.use(express.json());

const static_path = path.join(__dirname, "./public");

app.use(express.static(static_path));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

const session = require("express-session");

const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const routes = require("./routes/user");
const admin = require("./routes/admin");
const product = require("./routes/product");
const bag = require("./routes/bag");
const Payment = require("./routes/payment");
const errorHandler = require('./middleware/errorhandler');
const logger = require('./middleware/logger');
app.set('views', path.join(__dirname, 'views'));



// const upload = require('./uplaods/multer');

// const cloudinary = require('./cloud/cloudnary');
app.use(flash());

// *********************************************************************************
const multer = require("multer");
const { send } = require("process");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
    // Temporary folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// *****************************************************************************************

// **************************start server
dbconnect();


// Middleware for session
const MongoStore = require("connect-mongo");
app.use(
  session({
    name: "user",
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.dbURI, // Replace with your MongoDB connection string
      ttl: 7 * 24 * 60 * 60, // Session TTL in seconds (optional)
      autoRemove: "interval",
      autoRemoveInterval: 10, // Interval in minutes to remove expired sessions (optional)
    }),

    cookie: {
      secure: false,
      maxAge: 700000, // 1 hour in milliseconds
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ************************************cloudinary config

// templates*****************
app.get("/api/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.use("/", routes);
app.use("/admin", admin);
app.use("/product", product);
app.use("/bag", bag);
app.use("/payment", Payment);


app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

app.get("/demo1", (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }
    

    // If user is found, render the view template without error
    res.render("demo", { error: null });
  } catch (err) {
    // If an error occurs, render the view template with the error message
    res.render("demo", { error: err.message });
  }
});
// Error handling middleware


app.get("/success", (req, res) => {
  res.send("payment submitted successfully!");
});

// Route for error page
app.get("/error", (req, res) => {
  res.send("error to submit payment ");
});

app.get("/payment", (req, res) => {
  res.render("payment/payment");
});
app.get("*", (req, res) => {
  res.render("notfound");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const serverStartTime = new Date().toLocaleString();
  console.log(`
    ====================================================
    Server is started
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    Date and Time: ${serverStartTime}
    Visit: http://localhost:${PORT}
    ====================================================
  `);
});
