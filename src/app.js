// creating Express.js Server
const express = require('express');
const app = express();
const port = 7777;

app.get("/getUserData", (req, res) => {
    try{
        throw new Error("Error while fetching user data!!");
    res.send("user data sent!!");
    }catch(err){
        res.status(500).send("Internal Server Error!!");
    }
});

app.use("/", (err, req, res, next) => {
    if(err){
        // log your error
        res.status(500).send("Internal Server Error!!");
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


