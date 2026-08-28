// importing mongoose module
const mongoose = require('mongoose');
// validator module is used to validate email, password, and other fields in the user model
// validator is a npm library that provides string validation and sanitization functions
// importing validator module to validate email
const validator = require('validator');
const jwt = require('jsonwebtoken'); // importing jsonwebtoken module to create and verify JWT tokens
const bcrypt = require('bcrypt'); // importing bcryptjs module to hash the password before saving to the database

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
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
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not supported`,
        },
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

userSchema.index({firstName: 1, lastName: 1, email: 1}); // creating a compound index on firstName, lastName, and email to ensure uniqueness of users

userSchema.methods.getJWT = async function() {
    const user = this; // this refers to the current user instance

    const token = await jwt.sign(
        { _id: user._id }, 
        "DEV@Tinder$799087", 
        {expiresIn: "7d"} 
    ); // creating a JWT token with the user's ID and a secret key, expiring in 1 hour

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password; // getting the hashed password from the user instance
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash); // comparing the provided password with the hashed password in the database

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);
