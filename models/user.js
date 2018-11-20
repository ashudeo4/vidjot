const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

// mongoose.model('ideas', IdeaSchema);
var User = mongoose.model('User', UserSchema);

module.exports = User;