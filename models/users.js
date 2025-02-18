const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// User Schema

// const userSchema



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

userSchema.method.comparePassword = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password); // Create inputPassword function
}

module.exports = mongoose.model('User', userSchema);