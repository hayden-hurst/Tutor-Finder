const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const path = require('path');

const app = express();

let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/TutorApp'
const mongoUri = 'mongodb+srv://admin1:admin1@cluster0.htsmz.mongodb.net/TutorApp?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoUri)
.then(() => {
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch (err => console.log(err.message));

// Sessions
app.use(
    session({
        secret: "ihqfbJAFFIU91ASFH",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: mongoUri}),
        cookie: {maxAge: 60*60*1000}
    })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));


// NOT USING EJS FIND SOMETHING TO RENDER STATIC HTML PAGES
app.get('/', (req, res) => {
    res.render('index');
})

// Error Handlers

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});