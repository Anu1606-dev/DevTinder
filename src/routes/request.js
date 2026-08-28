const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');

// api for sending connection request to another user
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type:" + status});
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request sent successfully!!",
            data,
        })

    }catch(err){
        res.status(500).send("Error while sending connection request!!");
    }
})

module.exports = requestRouter;

