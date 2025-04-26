// run command: node scripts/clear-appointments.js

const mongoose = require('mongoose');
const Meeting = require('../models/meeting');
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0';

// Function to clear all appointments
async function clearAllAppointments() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB!");

        // Delete all meetings in the collection
        const result = await Meeting.deleteMany({});
        console.log(`${result.deletedCount} appointment(s) deleted.`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB!");
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

clearAllAppointments();