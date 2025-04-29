const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting'); // adjust if your model path differs

// GET /api/meetings/mine
router.get('/mine', async (req, res) => {
  try {
    const userEmail = req.session?.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const meetings = await Meeting.find({
      $or: [{ tutorEmail: userEmail }, { studentEmail: userEmail }]
    });

    const formattedMeetings = meetings.map(meeting => {
      const meetingDate = new Date(meeting.date);
      const dateStr = meetingDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const startTime = meeting.time;
      const duration = meeting.duration;
      const endTime = calculateEndTime(startTime, duration);

      const otherPerson = meeting.tutorEmail === userEmail ? meeting.studentEmail : meeting.tutorEmail;

      return {
        date: dateStr,
        title: `Meeting with ${otherPerson}`,
        location: meeting.locationDetails,
        start: startTime,
        end: endTime
      };
    });

    res.json(formattedMeetings);
  } catch (err) {
    console.error('Error fetching meetings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function calculateEndTime(start, durationMinutes) {
  const [hourStr, minuteStr] = start.split(':');
  const startDate = new Date(2000, 0, 1, Number(hourStr), Number(minuteStr));
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const hours = endDate.getHours().toString().padStart(2, '0');
  const minutes = endDate.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

module.exports = router;
