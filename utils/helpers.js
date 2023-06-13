const bcrypt = require('bcrypt');

const helpers = {
  // Hashes the provided password
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  },

  // Compares the provided password with the hashed password
  comparePassword: async (password, hashedPassword) => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  },
};

module.exports = helpers;
