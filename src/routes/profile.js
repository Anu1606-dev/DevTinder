const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth'); // importing the userAuth middleware to validate the JWT token and authorize the user

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user; // getting the user object from the request object set by the userAuth middleware
        res.send(user); // sending the user object as a response back to the client

    } catch(err){
        console.log("Error while fetching user profile!!");
        console.log(err);
        res.status(500).send("Error while fetching user profile!!");
    }
});

module.exports = profileRouter;



