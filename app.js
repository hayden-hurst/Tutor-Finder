const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const MongoStore = require('connect-mongo');
const path = require('path');
const User = require('./models/users')

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
    store: MongoStore.create({ mongoUrl: url }), // store sessions in MongoDB
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


// Fetch all user profiles
app.get('/api/users', async (req, res) => {
    try {
        // Fetch all users from the database, excluding passwords
        const users = await User.find().select('firstName lastName email'); // Only select the fields we need
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving users', message: err.message });
    }
});




mongoose.connect(url)
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch (err => console.log(err.message));