const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

// Set up Handlebars.js as the template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Define your routes and other app configurations here

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
