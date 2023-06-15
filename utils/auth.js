const withAuth = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.loggedIn) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to the sign-up page
      res.redirect('/signup');
    }
  };
  
  module.exports = withAuth;  