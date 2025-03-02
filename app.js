const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/TutorApp'
//app.set('view engine')
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'supersecretkey', // replace with process.env.SESSION_SECRET in production
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: mongoUri }), // store sessions in MongoDB
    cookie: { secure: false } // not secured for local development
}));


app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});
app.get('/calendar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'calendar.html'));
});

// Routes
app.use('/api/auth', authRoutes);

mongoose.connect(mongoUri)
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch (err => console.log(err.message));