const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Meeting schema
const meetingSchema = new Schema ({
    studentEmail: { type: String, required: [true, 'Student Email is required!']},
    tutorEmail: { type: String, required: [true, 'Tutor Email is required!']},
    date: { type: Date, required: [true, 'Date is required!']},
    time: { type: String, required: [true, 'Time is required!']}
});