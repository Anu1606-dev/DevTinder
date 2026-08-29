const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // reference to the collection
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is not supported`,
            },
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // creating a compound index on fromUserId and toUserId to ensure uniqueness of connection requests between users

// pre-save middleware to check if the fromUserId and toUserId are the same
connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!!");
    }
});

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
);

module.exports = connectionRequestModel;

