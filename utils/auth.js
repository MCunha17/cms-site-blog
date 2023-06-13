const withAuth = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.session.logged_in) {
    res.status(401).json({ message: 'Access is required to login.' });
  } else {
    // If the user is authenticated, proceed to the next middleware or route handler
    next();
  }
};

// Exports to be used in other files
module.exports = withAuth;