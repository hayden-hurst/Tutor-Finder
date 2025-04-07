// run command: node scripts/run-migrations.js
// This file is used to update existing users in the database with new fields

const mongoose = require('mongoose');
const User = require('../models/users')
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

async function migrateUsers (){

    try{
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB!")

        // displays current user schema
        const sample = await User.findOne();
        console.log("Current schema:")
        console.log(Object.keys(sample.toObject()));


        // migration logic
        const result = await User.updateMany(
            {
                $or: [
                    {bio: {$exists: false}},
                    {year: {$exists: false}}
                ]
            },
            {
                $set: {
                    bio: "This user hasn't written a bio yet.",
                    year: "Junior"
                }
            }
        );

        console.log(`${result.modifiedCount} users updated.`);

        await mongoose.disconnect()
        console.log("Disconnected from MongoDB!")
    } catch (err) {
        console.error("Migration error:", err);
        process.exit(1);
    }
}

migrateUsers()

