const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://sarkaranushka614_db_user:cjNch6t3vdhgA1K5@anunodecluster.ia8okbh.mongodb.net/DevTinder"
    );
};

module.exports = connectDB;








