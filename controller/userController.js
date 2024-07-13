const Login = require("../database/register");
const payment = require("../database/payment");
const passport = require('passport');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const copy = require('../middleware/global');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


exports.home = (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    const user = req.user;
    console.log(req.session.id);
   
   
    res.render("main/index", { isAuthenticated, user , error: null  });
  };


exports.getRegister = (req,res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  res.render("main/register", { errorMessage, successMessage });
}
exports.getLogin = (req,res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  res.render("main/login2", { errorMessage, successMessage });
}

exports.postRegister = async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { username, name, email, password } = req.body;
    console.log(username, name, email, password);

    // Replace this with your actual MongoDB model
    const existingUser = await Login.findOne({ email });

    // If the user already exists, show an error message
    if (existingUser) {
      req.flash("error", "User already exists.");
      return res.redirect("/register");
    }

    // If the user doesn't exist, create a new user
    const newUser = new Login({
      username,
      name,
      email,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Set a flash success message
    req.flash("success", "Registration successful. You can now log in.");

    // Redirect to the login page
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    // Handle any errors that occurred during registration
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
}


exports.postLogin = async (req, res) => {
try {
  return res.redirect("/");
  
} catch (error) {
  console.log(error);
}
}


exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }

      res.redirect("/");
      console.log("session closed");
    });

    // Redirect to the login page or any other desired page after logging out
  });
};


 exports.getProfile = async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const authenticatedUserId = req.user.id; // Get authenticated user's ID
  const requestedUserId = req.params.id; // Get requested user's ID from URL params

  // Check if the authenticated user is trying to access their own profile
  if (authenticatedUserId !== requestedUserId) {
    return res.redirect("/");
  }

  try {
    // Fetch user profile using the requested user's ID
    const userProfile = await Login.findById(requestedUserId);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    const Payment = await payment.findOne({
      user: requestedUserId,})
      console.log(Payment)

      let paymentIsNull;


    if (!Payment) {
      console.log("User payment not done yet");
      return res.render("main/profile", { user: userProfile, userId: requestedUserId,isAuthenticated,paymentIsNull:true, error: null });

    }


    // Render the 'profile' view with the user profile data
    res.render("main/profile", { user: userProfile, userId: requestedUserId,isAuthenticated, Payments: Payment.payments,paymentIsNull:false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.postProfile = async (req, res) => {
  const authenticatedUserId = req.user.id; // Get authenticated user's ID
  const requestedUserId = req.params.id; // Get requested user's ID from URL params

  // Check if the authenticated user is trying to update their own profile

  if (authenticatedUserId !== requestedUserId) {
    return res.redirect("/");
  }

  try {
    // Fetch user profile using the requested user's ID
    let userProfile = await Login.findById(requestedUserId);

    if (!userProfile) {
      console.log("User profile not found");
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if editing mode is enabled

    // Update user profile data

    userProfile.username = req.body.username
      ? req.body.username.trim()
      : userProfile.username;
    userProfile.name = req.body.name ? req.body.name.trim() : userProfile.name;
    userProfile.email = req.body.email
      ? req.body.email.trim()
      : userProfile.email;
    userProfile.contactNumber = req.body.contactNumber
      ? req.body.contactNumber.replace(/^0+/, "")
      : userProfile.contactNumber;
    userProfile.address = req.body.address
      ? req.body.address.trim()
      : userProfile.address;

    // Validate the updated user profile data contactNumber

    // You can add more specific validation checks here if needed

    // Save the updated user profile
    await userProfile.save();

    // Respond with the updated user profile
    console.log("successful");
    console.log(userProfile);
    const referer = req.headers.referer;
    console.log(referer);
    if (referer && referer.includes("/checkout")) {
      // If the referer contains '/checkout', redirect to the checkout page
      return res.redirect("/payment/checkout"); // Use an absolute path
    } else {
      // If the referer doesn't contain '/checkout', redirect to the profile page
      return res.redirect(`/profile/${authenticatedUserId}`); // Use a root-relative path
    }
    
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postPassword= async (req,res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // Fetch user from database
    const user = await Login.findById(userId);

    // Verify if user exists
    if (!user) {
      return res.status(404).json("user not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password

    // Update user's password
    user.password = newPassword;
    console.log(user.password);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}




exports.getUserRole= async (req,res) => {
  try {
    const user = req.user
   
    if (user.userRole=== 'Admin') {
      res.json({ message:"Admin" }).status(200);
    }
    else res.json({ message:"not found" }).status(404);
  } catch (error) {
    res.json({ message: "Internal server error" }).status(500);
  }
 
}

exports.getAbout= async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user;
res.render("main/about", { isAuthenticated, user  })
}
exports.getContact= async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user;
res.render("main/contact", { isAuthenticated, user  })
}

exports.postContact= async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  let  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
  });
  let mailOptionsToSelf = {
    from: `Dhananjay kakade <no-reply@freshfitfinds.com>`, 
    to: 'kakadedhananjay59@gmail.com',
    subject: 'Contact Form Submission', 
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` 
  };

  
  let mailOptionsToUser = {
    from:`no-reply@freshfitfinds.com`, 
    to: email,
    subject: 'Thank you for contacting Us', 
    text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you soon.`,
  };

  
  Promise.all([
    transporter.sendMail(mailOptionsToSelf),
    transporter.sendMail(mailOptionsToUser)
  ]).then(info => {
    console.log('Emails sent:', info);
    res.status(200).json({ message: 'Emails sent successfully' });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while sending emails' });
  });
}


exports.getTerms = (req,res) => {
  res.render("main/terms")
};
exports.getPrivacy = (req,res) => {
  res.render("main/privacy")
};