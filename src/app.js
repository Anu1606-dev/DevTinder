// creating Express.js Server
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const port = 7777;

app.post("/signup", async (req, res) => {
    // creating a new user instance using the User model
    const user = new User({
        firstName: "Anu",
        lastName: "Sarkar",
        email: "example@gmail.com",
        password: "123456",
        age: 21,
        gender: "Female"
    });

    try {
        // saving the user instance to the database
        await user.save();
        // sending a response back to the client
        res.send("User created successfully!!");
    }catch (err) {
        // handling any errors that occur during the save operation
        console.log("Error while creating user!!");
        console.log(err);
        res.status(500).send("Error while creating user!!");
    }
});

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




