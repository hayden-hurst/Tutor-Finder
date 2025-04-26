const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const User = require('../models/users');
const { sendInitialConfirmation } = require('../utils/email-alerts');

// Protect route
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    next();
};

// reusable date and time combination
function combineDateAndTime(dateObj, timeStr) {
    const datePart = dateObj instanceof Date ? dateObj.toISOString().split('T')[0] : dateObj;
    return new Date(`${datePart}T${timeStr}`);
}

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

        // check for time conflicts

        // convert date and time to a Date object for comparison
        const meetingStart = new Date(`${date}T${time}`);
        const meetingEnd = new Date(meetingStart.getTime() + duration * 60000); // duration is in minutes

        // build start and end of the day for the query
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        // find any meetings for this tutor on the same day
        const existingMeetings = await Meeting.find({
            tutorEmail,
            date: {
                $gte: dayStart,
                $lte: dayEnd
            }
        });

        // check for overlap
        const isOverlapping = existingMeetings.some(meeting => {
            const existingStart = combineDateAndTime(meeting.date, meeting.time);
            const existingEnd = new Date(existingStart.getTime() + meeting.duration * 60000);

            return (
                (meetingStart < existingEnd) && (meetingEnd > existingStart)
            );
        });

        if (isOverlapping) {
            return res.status(409).json({ error: 'This appointment overlaps with another scheduled appointment.' });
        }

        // no conflicts -> create meeting
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

        // sends appointment email
        await sendInitialConfirmation({
            tutorEmail,
            studentEmail: student.email,
            date,
            time,
            duration,
            locationType,
            locationDetails,
        });


        res.status(201).json({ message: 'Meeting successfully scheduled and email successfully sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while scheduling meeting' });
    }
});

module.exports = router;
