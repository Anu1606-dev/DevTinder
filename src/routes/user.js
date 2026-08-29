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
        }).populate("fromUserId", ["firstName", "LastName", "photoUrl", "about", "skills"]);

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
        }).populate("fromUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => row.fromUserId)
        res.json({ data });

    }catch(err) {
        res.status(400).send({ message: "Error!!" + err.message})
    }
});

module.exports = userRouter;

