const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');

// get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
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

module.exports = userRouter;

