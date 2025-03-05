const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

/**
 * Logs in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token
        res.json({ token });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

/**
 * Updates the user's profile.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateUserProfile = async (req, res) => {
    const { userId, newUsername } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the username
        user.username = newUsername;
        await user.save();

        // Respond with success message and updated user
        res.status(200).json({ message: 'Username updated successfully', user });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

// Export the controller functions
module.exports = { registerUser, loginUser, updateUserProfile };