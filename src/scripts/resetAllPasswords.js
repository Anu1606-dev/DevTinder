const bcrypt = require("bcrypt");
const connectDB = require("../config/database");
const User = require("../models/user");

const NEW_PASSWORD = "Test@1234";

const resetAllPasswords = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully!!");

        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

        const result = await User.updateMany(
            {},
            { $set: { password: hashedPassword } }
        );

        console.log(`Updated ${result.modifiedCount} user(s) to password: ${NEW_PASSWORD}`);
        process.exit(0);
    } catch (err) {
        console.error("Error resetting passwords:", err);
        process.exit(1);
    }
};

resetAllPasswords();