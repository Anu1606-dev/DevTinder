// creating Express.js Server
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 7777;

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




