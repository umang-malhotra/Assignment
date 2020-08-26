const mongoose = require('mongoose');

// Page Schema

const NotesSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    note: {
        type: String,
        required: true
    },
});

const User = module.exports = mongoose.model('Note',NotesSchema);