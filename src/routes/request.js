const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user'); 

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


        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: "User not found!!"});
        }

        // check if there is an existing Connectionrequest
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        }); 

        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection request already exists!!"});
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

