const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

const { ensureAuthenticated ,ensureLogged }= require('../middleware/ensureAuthenticated');
const copy = require('../middleware/global');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Login = require('../database/register');
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Specify the field you want to use for username
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await Login.findOne({ username });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Login.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});








router.get("/", userController.home);
router.get("/register",ensureLogged, userController.getRegister);
router.post("/register", userController.postRegister);
router.get("/login",ensureLogged, userController.getLogin);
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successRedirect: '/',
}), userController.postLogin);

router.get("/logout", userController.getLogout);
router.get("/profile/:id",ensureAuthenticated, userController.getProfile);
router.post("/profile/:id",ensureAuthenticated, userController.postProfile);
router.post("/change-password/:id",ensureAuthenticated, userController.postPassword);
router.get("/userRole",ensureAuthenticated, userController.getUserRole);
router.get("/about", userController.getAbout);
router.get("/contact", userController.getContact);
router.get("/terms_and_conditions", userController.getTerms);
router.get("/privacy_policy", userController.getPrivacy);
router.post("/contact", userController.postContact);

module.exports = router;
     
     