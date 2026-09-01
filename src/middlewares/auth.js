const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        // Read the token from the request
        const cookies = req.cookies;
        const { token } = cookies;
        // validate the token
        if(!token) {
            return res.status(401).send("Please login!!");
        }

        // extracxted decoded object 
        const decodedObj = await jwt.verify(token, "DEV@Tinder$799087");

        const { _id } = decodedObj;

        // find the user
        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).send("User not found!!");
        }

        req.user = user;
        next();
    }catch(err) {
        return res.status(400).send("ERROR: " + err.message);
    }
};

module.exports = { userAuth };