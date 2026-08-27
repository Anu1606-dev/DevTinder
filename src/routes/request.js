const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

// api for sending connection request to another user
requestRouter.post("/sendConnectionRequest", userAuth, async(req, res) => {
    try{
        const user = req.user; // getting the user object from the request object set by the userAuth middleware
        // sending a connection request to another user
        console.log("sending Request sent");

        res.send(user.firstName + " " + "sent the connection request successfully!!");

    }catch(err){
        res.status(500).send("Error while sending connection request!!");
    }
})

module.exports = requestRouter;

