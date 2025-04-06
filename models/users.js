const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// User Schema

// const userSchema
const userSchema = new Schema ({
    firstName: {type: String, required: [true, 'First Name is required!']},
    lastName: {type: String, required: [true, 'Last Name is required!']},
    email: {type: String, required: [true, 'Email is required!']},
    major: {type: String, required: [true, 'Major is required!']},
    password: {type: String, required: [true, 'Password is required!']},
    year: {type: String, required: [true, 'Year is required!']},
    bio: {type: String, required: false, default: "This user hasn't written a bio yet.",
        set: value => { //if bio is blank it will set to default bio
            if (typeof value !== 'string' || value.trim() === '') {
                return "This user hasn't written a bio yet.";
            }
            return value;
        }
    }
});

// Password Hashing
 
userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err => next(err)); // create Error Handler
});

// Compares input password in app to the password stored in the database
 userSchema.methods.comparePassword = async function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password); 
} 

module.exports = mongoose.model('User', userSchema);