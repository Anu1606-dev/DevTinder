const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const {userAuth} = require('../middlewares/auth'); // importing the userAuth middleware to validate the JWT token and authorize the user
const { validateEditProfileData } = require('../utils/validate'); // importing the validation function for edit profile data


// profile route to get the user profile data
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user; // getting the user object from the request object set by the userAuth middleware
        res.send(user); // sending the user object as a response back to the client

    } catch(err){
        console.log("Error while fetching user profile!!");
        console.log(err);
        res.status(500).send("Error while fetching user profile!!");
    }
});

// profile route to update the user profile data
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid fields in request body!!");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); // updating the user object with the new data from the request body
        await loggedInUser.save();

        res.send({
            message: `${loggedInUser.firstName}, your profile updated successfully!!`,
            data: loggedInUser,
        });

    }catch(err) {
        res.status(400).send("ERROR: " + err.message); // sending a 400 Bad Request response with the error message if validation fails
    }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, oldPassword, newPassword } = req.body;
        const passwordToVerify = currentPassword || oldPassword;

        if (typeof passwordToVerify !== "string" || typeof newPassword !== "string" || !passwordToVerify || !newPassword) {
            return res.status(400).send("Current and new passwords are required!!");
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).send("Please enter a strong password!!");
        }

        const isCurrentPasswordValid = await req.user.validatePassword(passwordToVerify);
        if (!isCurrentPasswordValid) {
            return res.status(401).send("Current password is incorrect!!");
        }

        req.user.password = await bcrypt.hash(newPassword, 10);
        await req.user.save();

        res.send("Password updated successfully!!");
    } catch (err) {
        res.status(500).send("Error while updating password!!");
    }
});


module.exports = profileRouter;



