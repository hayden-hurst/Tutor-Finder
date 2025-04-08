const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth-api');
const profileRoutes = require('./routes/user-api');
const MongoStore = require('connect-mongo');
const path = require('path');
const User = require('./models/users')

//test
//const User = require('./models/users');

let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/TutorApp'
//app.set('view engine')
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(session({
    secret: 'supersecretkey', // replace with process.env.SESSION_SECRET in production
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: mongoUri }), // store sessions in MongoDB
    cookie: { secure: false } // not secured for local development
}));

const isAuthenticated = (req, res, next) => {
    // Check for authentication
    if (req.session && req.session.userId) {
        return next();
    }

    // For API requests, return a 401 status instead of redirecting
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }

    // For HTML page requests, redirect to login
    res.redirect('/login');
};

// page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './views/index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, './views/signup.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, './views/login.html')));
app.get('/profile', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, './views/profile.html')));
app.get('/calendar', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, './views/calendar.html')));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);

mongoose.connect(mongoUri)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch (err => console.log(err.message));
