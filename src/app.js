// creating Express.js Server
const express = require('express');
const app = express();
const port = 7777
const { adminAuth, userAuth } = require('./middlewares/auth');

app.use("/admin", adminAuth);

app.post("/user/login", (req,res) => {
    res.send("User logged in!!")
});

app.get("/user", userAuth, (req, res) => {
    res.end("User data sent!!");
});

app.get("/admin/getAllData", (req, res) => {
    res.end("All data sent!!");
});

app.get("/admin/deleteUser", (req, res) => {
    res.end("User deleted!!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


