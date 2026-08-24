// importing mongoose module
const mongoose = require('mongoose');
// creating a schema for user model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
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
    },
    password: {
        type: String,
        required: true
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
        defayult: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
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
