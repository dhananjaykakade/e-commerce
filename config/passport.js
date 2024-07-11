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

