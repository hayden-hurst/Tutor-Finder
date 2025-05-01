const express = require('express');
const User = require('../models/users.js');
const multer = require('../public/js/services/picture-upload');
const upload = multer.single('image')

const router = express.Router();

 router.post('/signup', upload, async (req, res) => {
    try {
        const { firstName, lastName, email, password, major, year, bio } = req.body;
        const availability = JSON.parse(req.body.availability); 
        const roles = { tutor: req.body.tutor === 'true', tutee: req.body.tutee === 'true'};
          
        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const profileImage = req.file ? '/uploads/' + req.file.filename : '';        

        const user = new User({ firstName, lastName, email, password, major, year, bio, availability, profileImage, roles });  
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message }); // details is for debugging purposes
    }
}); 

router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const user = await User.findOne({ email });

        if (!user){
            return res.status(401).json({error: 'User not found'})
        }
        //Check Password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({error: 'Invalid password'});
        }

        // Store user info in session
        req.session.userId = user._id;
        req.session.user = {
            email: user.email,
            _id: user._id
          };
        req.session.cookie.maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

        //Send response
        return res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: 'Logged out successfully' });
    });
});

// route used to check if session exists
router.get('/session', (req, res) => {
    if (req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

module.exports = router;
