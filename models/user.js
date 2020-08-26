const mongoose = require('mongoose');

// Page Schema

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        minlength: [6, 'Minimum length of password must be 6 characters'],
        required: true
    }
});

const User = module.exports = mongoose.model('User',UserSchema);