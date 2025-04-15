const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const User = require('../models/users');

// Protect route
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    next();
};

// POST /api/schedule-meeting
router.post('/schedule-meeting', authMiddleware, async (req, res) => {
    try {
        const { tutorEmail, date, time, duration, locationType, locationDetails } = req.body;

        // Get student email from session
        const student = await User.findById(req.session.userId);
        if (!student) {
            return res.status(404).json({ error: 'Logged-in student not found' });
        }

        if (!tutorEmail || !date || !time || !duration || !locationType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // If in-person, locationDetails is required
        if (locationType === 'In-Person' && !locationDetails) {
            return res.status(400).json({ error: 'Location details required for in-person meetings' });
        }

        const newMeeting = new Meeting({
            studentEmail: student.email,
            tutorEmail,
            date,
            time,
            duration,
            locationType,
            locationDetails: locationType === 'In-Person' ? locationDetails : '',
        });

        await newMeeting.save();
        res.status(201).json({ message: 'Meeting successfully scheduled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while scheduling meeting' });
    }
});

module.exports = router;
