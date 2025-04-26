const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const User = require('../models/users');
const { sendAppointmentConfirmation, sendUpdateAppointmentInfo, sendAppointmentCancellation} = require('../utils/email-alerts');

// Function to delete old meetings
async function deleteOldAppointments() {
    try {
        await Meeting.deleteMany({ endDateTime: { $lt: new Date() } });
        console.log('Old meetings cleaned up');
    } catch (err) {
        console.error('Error deleting old meetings:', err);
    }
}

// Immediately run once when the file loads
deleteOldAppointments();

// Set up interval to run it every hour
const SIX_HOURS_IN_MS = 60 * 60 * 1000;

// Runs deleteOldAppointments on the interval
setInterval(deleteOldAppointments, SIX_HOURS_IN_MS);

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

        // check for time conflicts

        // create start and end DateTimes
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        // Check if the scheduled time is in the past
        if (startDateTime < new Date()) {
            return res.status(400).json({ error: 'You cannot schedule a meeting for a past time.' });
        }

        // find any meetings for this tutor that overlap
        const existingMeetings = await Meeting.find({
            tutorEmail,
            startDateTime: { $lt: endDateTime },
            endDateTime: { $gt: startDateTime }
        });

        if (existingMeetings.length > 0) {
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
            startDateTime,
            endDateTime,
        });

        await newMeeting.save();

        // sends appointment email
        try {
            await sendAppointmentConfirmation({
                tutorEmail,
                studentEmail: student.email,
                date,
                time,
                duration,
                locationType,
                locationDetails,
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({ error: 'Failed to send confirmation email' });
        }

        res.status(201).json({ message: 'Meeting successfully scheduled and email successfully sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while scheduling meeting' });
    }
});

// edit meetings
router.patch('/schedule-meeting/:id', authMiddleware, async (req, res) => {
    try {
        const meetingId = req.params.id;
        const { date, time, duration, locationType, locationDetails } = req.body;

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        // update fields if provided
        if (date) meeting.date = date;
        if (time) meeting.time = time;
        if (duration) meeting.duration = duration;
        if (locationType) meeting.locationType = locationType;
        if (locationType === 'In-Person') {
            meeting.locationDetails = locationDetails || '';
        } else if (locationType === 'Online') {
            meeting.locationDetails = '';
        }

        // recalculate startDateTime and endDateTime if needed
        if (date || time || duration) {
            const newStart = new Date(`${meeting.date}T${meeting.time}`);
            const newEnd = new Date(newStart.getTime() + meeting.duration * 60000);
            meeting.startDateTime = newStart;
            meeting.endDateTime = newEnd;
        }

        await meeting.save();

        // send updated meeting info email
        try {
            await sendUpdateAppointmentInfo({
                tutorEmail: meeting.tutorEmail,
                studentEmail: meeting.studentEmail,
                date: meeting.date,
                time: meeting.time,
                duration: meeting.duration,
                locationType: meeting.locationType,
                locationDetails: meeting.locationDetails
            });
        } catch (emailError) {
            console.error('Error sending update email:', emailError);
            // continue even if email fails
        }

        res.json({ message: 'Meeting updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while updating meeting' });
    }
});

// DELETE /api/schedule-meeting/:id
router.delete('/schedule-meeting/:id', authMiddleware, async (req, res) => {
    try {
        const meetingId = req.params.id;

        // Find the meeting before deleting it
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        // Send cancellation email first with the meeting details
        try {
            await sendAppointmentCancellation({
                tutorEmail: meeting.tutorEmail,
                studentEmail: meeting.studentEmail,
                date: meeting.date,
                time: meeting.time,
                duration: meeting.duration,
                locationType: meeting.locationType,
                locationDetails: meeting.locationDetails,
            });
        } catch (emailError) {
            console.error('Error sending cancellation email:', emailError);
            // Continue even if the email fails
        }

        // Delete the meeting after sending the email
        await Meeting.findByIdAndDelete(meetingId);

        res.json({ message: 'Meeting successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while deleting meeting' });
    }
});

module.exports = router;
