function checkRole() {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.userRole === "Admin") {
      return next();
    }
    res.redirect('/login'); // Redirect unauthorized users to the login page
  };
}

module.exports =  checkRole ;

