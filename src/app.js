// creating Express.js Server
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 7777;
const cookieParser = require('cookie-parser'); // importing cookie-parser module to parse cookies from the request headers

app.use(cookieParser()); // middleware to parse cookies from the request headers
app.use(express.json()); // middleware to parse JSON request bodies

const authRouter = require('./routes/auth'); // importing the auth router
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile'); // importing the profile router
const userRouter = require('./routes/user'); // importing the user router

app.use("/", authRouter); // using the auth router for all routes starting with /auth
app.use("/", requestRouter);
app.use("/", profileRouter); // using the profile router for all routes starting with /profile
app.use("/", userRouter); // using the user router for all routes starting with /user


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




