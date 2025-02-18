const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/TutorApp'
//app.set('view engine')
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoUrl)
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch (err => console.log(err.message));