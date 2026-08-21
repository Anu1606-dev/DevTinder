// importing mongoose module
const mongoose = require('mongoose');
// creating a schema for user model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);
