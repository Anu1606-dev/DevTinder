// creating Express.js Server
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const port = 7777;
const mongoose = require('mongoose');

app.use(express.json()); // middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {
    // creating a new user instance using the User model
    const user = new User(req.body); // creating a new user instance using the User model
    try {
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
        if(data?.skills.length > 10){
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




