function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/login");
    }
  }
function ensureLogged(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    } else {
      return next(); 
    }
  }

  const jwt = require("jsonwebtoken");
  const secretKey = "dhananjayprashnatkakade";
  function verifyJWT(req, res, next) {
    // Retrieve JWT from cookie
    const token = req.cookies.jwt;
  
    // Verify JWT
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        // JWT verification failed
        return res.status(401).send("Unauthorized");
      }
      // JWT verification successful
      req.user = decoded;
      next();
    });
  }


  
module.exports = { ensureAuthenticated ,ensureLogged,verifyJWT };