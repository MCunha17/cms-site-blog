const router = require('express').Router();
const { User } = require('../../models');

router.post('/signup', async (req, res) => {
    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Create a new user record in the database
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;

// Login route
router.post('/login', async (req, res) => {
  try {
    // Fetch the user by their email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    // Check if the provided password matches the stored password
    const isValidPassword = await user.checkPassword(req.body.password);

    if (!isValidPassword) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    // Set the `logged_in` session variable to `true` and the `user_id` session variable to the user's ID
    req.session.logged_in = true;
    req.session.user_id = user.id;

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the session data and redirect the user to the home page or any other desired page
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;