// models/meeting.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    studentEmail: { type: String, required: true },
    tutorEmail: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    locationType: { type: String, enum: ['Online', 'In-Person'], required: true },
    locationDetails: { type: String },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

