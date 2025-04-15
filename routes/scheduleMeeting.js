const express = require('express');
const User = require('../models/users.js');
const Meeting = require('../models/meeting.js');

const router = express.Router();

router.post('/schedule-meeting', async (req, res) => {
    try{
        const { studentEmail, tutorEmail, date, time} = req.body;

        const newMeeting = new Meeting({
            studentEmail,
            tutorEmail,
            date,
            time
        });
        await newMeeting.save();

        res.status(201).json({ message: 'Meeting scheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message});
    }
    
});


module.exports = router;