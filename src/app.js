// creating Express.js Server
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const port = 7777;
const mongoose = require('mongoose');
const { validateSignupData } = require('./utils/validate'); // importing the validation function for signup data
const bcrypt = require('bcrypt'); // importing bcryptjs module to hash the password before saving to the database
const cookieParser = require('cookie-parser'); // importing cookie-parser module to parse cookies from the request headers
const jwt = require('jsonwebtoken'); // importing jsonwebtoken module to create and verify JWT tokens

app.use(cookieParser()); // middleware to parse cookies from the request headers
app.use(express.json()); // middleware to parse JSON request bodies


// api for signup
app.post("/signup", async (req, res) => {

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
        console.log("Error while creating user!!");
        console.log(err);
        res.status(500).send("Error while creating user!!");
    }
});

// api for login
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ email: emailId.toLowerCase() }); // finding the user by email in the database (lowercase to match stored value)
        if (!user) {
            return res.status(401).send("Invalid credentials!!");
        }
        // check for emailId and password validation

        const isPasswordValid = await bcrypt.compare(password, user.password); // comparing the provided password with the hashed password in the database
        if (isPasswordValid) {
            // logic of JWT authentication and concept of cookies
            // Creating JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$799087"); // creating a JWT token with the user's ID and a secret key, expiring in 1 hour

            //Add the token to cookie and send the response back to the user
            res.cookie("token", token);

            return res.send("User logged in successfully!!");
        } else {
            throw new Error("Invalid credentials!!");
        }

    } catch (err) {
        // handling any errors that occur during the save operation
        console.log("Error while logging in user!!");
        console.log(err);
        res.status(500).send("Error while logging in user!!");
    }
})

// get profile of the user
app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token) {
            throw new Error("Invalid token!!");
        }

        // validate my token 
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$799087");
        const { _id } = decodedMessage;

        const user = await User.findById({ _id });
        if (!user) {
            return res.status(404).send("User not found!!");
        }else{
            res.send(user);
        }

        console.log(cookies);
        res.send("Reading cookies from the request headers!!");

    } catch(err){
        console.log("Error while fetching user profile!!");
        console.log(err);
        res.status(500).send("Error while fetching user profile!!");
    }
})

// get user by email
app.get("/user", async (req, res) => {
    // Prefer query param for GET, fallback to body if provided
    const email = (req.query.email || req.body?.email || "").trim();
    if (!email) {
        return res.status(400).send("Email is required. Use /user?email=example@gmail.com");
    }
    try {
        // finding the user by email in the database
        const user = await User.findOne({ email });

        if (!user) {
            // if user is not found, send a 404 response
            return res.status(404).send("User not found!!");
        }
        // send found user
        return res.status(200).json(user);
    } catch (err) {
        // handling any errors that occur during the find operation
        console.log("Error while fetching user!!");
        console.log(err);
        return res.status(500).send("Error while fetching user!!");
    }
});

// Feed API -Get /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Error while fetching users!!");
    }
});

// delete user
app.delete("/deletedUser", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted successfully!!");
    } catch (err) {
        res.status(400).send("Error while deleting user!!");
    }
})

// update dat aof the user
app.patch("/updateUser/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;


    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "password", "age", "skills", "about", "photoUrl"];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new error("Invalid updates!!");
        }
        if (data?.skills.length > 10) {
            throw new error("Skills cannot be more than 10!!");
        }

        const user = await User.findByIdAndUpdate(
            { _id: userId },
            data,
            { returnDocument: 'before', runValidators: true }
        );
        console.log(userId);
        res.send("User updated successfully!!");
    } catch (err) {
        console.log("Error while updating user!!");
        console.log(err);
        res.status(400).send("Error while updating user!!");
    }
});

// Validator (authenticatio middleware or library) to check if the user is authorized to access the API or not

//Best practice-> connect the database first before starting the application
connectDB().then(() => {
    // connect to database first 
    console.log("MongoDB connected successfully!!");
    // listening to port(starting the application)
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}).catch((err) => {
    console.log("Error while connecting to MongoDB!!");
    console.log(err);
});




