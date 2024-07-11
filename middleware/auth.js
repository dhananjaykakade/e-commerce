function checkRole(role) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user && req.user.userRole === role) {
        return next();
      }
      res.redirect('/login'); // Redirect unauthorized users to the login page
    };
  }
  
  module.exports = { checkRole };
  