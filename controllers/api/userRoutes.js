const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new user
    const newUser = await User.create({ username, password });

    // You can perform additional actions here, such as logging in the user or sending a confirmation email

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userData = await User.findOne({ where: { email } });
  
      if (!userData) {
        res.status(400).json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
  
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;