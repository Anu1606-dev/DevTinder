const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
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


const connectionRequestModel = new mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
);

module.exports = connectionRequestModel;

