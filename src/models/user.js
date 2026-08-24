// importing mongoose module
const mongoose = require('mongoose');
// validator module is used to validate email, password, and other fields in the user model
// validator is a npm library that provides string validation and sanitization functions
// importing validator module to validate email
const validator = require('validator');
// creating a schema for user model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid!!" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender must be either male, female or other!!");
            }
        }
    },
    photoUrl: {
        type: String,
        defayult: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("URL is invalid!!" + value);
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder",
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,  
});

module.exports = mongoose.model('User', userSchema);
