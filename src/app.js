// creating Express.js Server
const express = require('express');
const app = express()
const port = 7777

// example of GET request handler
app.get('/user/:userId/:name/:password', (req, res) => { // dynamic routing
    console.log(req.params) // route parameters
    console.log(req.query) // query parameters
    res.send({ name: "Anushka", age: 20, email: "anushka@example.com" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


