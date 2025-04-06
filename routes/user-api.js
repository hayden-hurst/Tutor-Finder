const express = require("express");
const User = require("../models/users.js");

const router = express.Router();

const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    next();
};

// route used to fetch info of all users
router.get('/list', async (req, res) => {
    try {
        // Fetch all users from the database, excluding passwords
        const users = await User.find().select('firstName lastName email'); // Only select the fields we need
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving users', message: err.message });
    }
});

// route used to fetch info of the user logged into the current session
router.get('/me', authMiddleware, async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
});

// route used to edit the info of the user logged into the current session
router.patch('/me', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, major, year, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId, // <--- use this directly
            { firstName, lastName, major, year, bio },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// route used to fetch info of specific user
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;