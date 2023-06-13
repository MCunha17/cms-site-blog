const withAuth = (req, res, next) => {
  // Redirect to login page if the user is not logged in
  if (!req.session.loggedIn) {
      res.redirect('/login');
  } else {
      next();
  }
};

module.exports = withAuth;