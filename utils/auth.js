const requireAuth = (req, res, next) => {
  if (req.session.logged_in) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page or display an error message
    res.redirect('/login'); // Redirect to the login page
    // Alternatively, you can render an error view with a message
    // res.render('error', { message: 'Please log in to access the dashboard' });
  }
};

module.exports = { requireAuth };