const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require('../utils/validate'); // importing the validation function for signup data
const User = require('../models/user');
const bcrypt = require('bcrypt'); // importing bcryptjs module to hash the password before saving to the database

authRouter.post("/signup", async (req, res) => {

    try {
        // validation of data
        validateSignupData(req);

        // destructuring the request body to get the user data
        const { firstName, lastName, emailId, password, age, gender } = req.body;

        //encrypting the password before saving to the database
        const passwordHash = await bcrypt.hash(password, 10); // hashing the password with a salt round of 10

        // creating a new user instance using the User model
        const user = new User({
            firstName,
            lastName,
            email: emailId,
            password: passwordHash, // saving the hashed password
            age,
            gender,
        }); // creating a new user instance using the User model

        // saving the user instance to the database
        await user.save();

        // sending a response back to the client
        res.send("User created successfully!!");

    } catch (err) {
        // handling any errors that occur during the save operation
        console.log(err);
        res.status(500).send("Error while creating user!!")
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (typeof emailId !== "string" || typeof password !== "string" || !emailId.trim() || !password) {
            return res.status(400).send("Email and password are required!!");
        }

        const user = await User.findOne({ email: emailId.trim().toLowerCase() }); // finding the user by email in the database (lowercase to match stored value)
        if (!user) {
            return res.status(401).send("Invalid credentials!!");
        }
        // check for emailId and password validation

        const isPasswordValid = await user.validatePassword(password); // comparing the provided password with the hashed password in the database
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) });

            const userObj = user.toObject();
            delete userObj.password;
            res.send(userObj);
        } else {
            return res.status(401).send("Invalid credentials!!");
        }

    } catch (err) {
        console.log("Error while logging in user!!");
        console.log(err);
        res.status(500).send("Error while logging in user!!");
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.end("User logged out successfully!!");

    } catch (err) {
        res.status(500).send("Error while logging out user!!")
    }
})

module.exports = authRouter;



