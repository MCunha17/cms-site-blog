const withAuth = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.loggedIn) {
      // If user is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // If user is not authenticated, redirect to the sign-up page
      res.redirect('/signup');
    }
  };
  
module.exports = withAuth;  