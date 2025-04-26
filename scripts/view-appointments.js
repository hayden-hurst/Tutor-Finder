// run command: node scripts/view-appointments.js

const mongoose = require('mongoose');
const Meeting = require('../models/meeting')
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

// lists all scheduled appointments
async function viewAppointments (){


    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB!")


        // displays current user schema
        const sample = await Meeting.find()
        console.log("appointment: ")
        console.log(sample);


        await mongoose.disconnect()
        console.log("Disconnected from MongoDB!")
    } catch(err){
        console.log(err);
        process.exit(1);
    }
}


viewAppointments()