const withAuth = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.loggedIn) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to the login page or send an error response
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
module.exports = withAuth;