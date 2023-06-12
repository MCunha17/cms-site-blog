const bcrypt = require('bcrypt');
const User = require('../models/user');

// Function to hash the password
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// Function to compare the provided password with the hashed password in the database
const comparePasswords = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Function to authenticate a user based on their username and password
const authenticateUser = async (username, password) => {
    try {
        const user = await User.findOne({ where: { username } });
        // User not found
        if (!user) {
            return false;
        }
        const match = await comparePasswords(password, user.password);
        // Authentication successful
        if (match) {
            return user;
        // Password do not match
        } else {
            return false;
        }
    } catch (error) {
        throw new Error('Error authenticating user');
    }
};

module.exports = {
    hashPassword,
    authenticateUser,
};