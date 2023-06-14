const router = require('express').Router();
const { User } = require('../../models');

// Post request to '/login'
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    // Retrieves the user data based on the provided userName using the User.findOne method from the 'User' model
    const userData = await User.findOne({ where: { userName } });
    if (!userData) {
      // If no user is found with the given username, responds with 400 status message
      res.status(400).json({ message: 'Incorrect username.' });
      return;
    }
    // If user is found, checks the password's validity
    const validPassword = await userData.checkPassword(password);
    if (!validPassword) {
      // If password is invalid, responds with 400 status message
      res.status(400).json({ message: 'Incorrect password.' });
      return;
    }
    // If the username and password are valid, saves the user's ID and sets the 'logged_in' property to 'true'
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      // Redirects the user to the '/dashboard' route
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);
    // If an error occurs, displays a 500 status message
    res.status(500).json({ error: 'Unable to login.' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Create a new user using the 'User.create' method from the 'User' model
    const newUser = await User.create({ username, password });
    // Saves user's ID and sets the 'logged_in' property to 'true'
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      // Redirects to the '/dashboard' route
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);
    // If error occurs, responds with a 500 status message
    res.status(500).json({ error: 'Unable to complete signup.' });
  }
});

// Post request to '/logout'
router.post('/logout', (req, res) => {
  // If the user is logged in, it distroys session and responds with 204 status message
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    // If the user is not logged in, responds with a 404 status message
    res.status(404).end();
  }
});

module.exports = router;