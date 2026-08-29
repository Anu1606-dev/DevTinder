const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills"];

// get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully!!",
            data: connectionRequests,
        });

    }catch(err){
        res.status(500).send("Error!!" + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        console.log(connectionRequests);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ connectionRequests });

    }catch(err) {
        res.status(400).send({ message: "Error!!" + err.message})
    }
});

// get the feed - list of users excluding connections, ignored, and current user
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find all connection requests (sent and received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        // Extract all user IDs that have connection requests
        const excludedUserIds = new Set();
        excludedUserIds.add(loggedInUser._id.toString());
        connectionRequests.forEach((req) => {
            excludedUserIds.add(req.fromUserId.toString());
            excludedUserIds.add(req.toUserId.toString());
        });

        // Get feed - users not in connection list
        const feed = await require('../models/user').find({
            _id: { $nin: Array.from(excludedUserIds) }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            message: "Feed fetched successfully!!",
            data: feed,
        });
    } catch (err) {
        res.status(400).send({ message: "Error!!" + err.message });
    }
});

module.exports = userRouter;

