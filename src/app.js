// creating Express.js Server
const express = require('express');
const app = express()
const port = 7777

// example of GET request handler
app.get('/user', (req, res) => {
  res.send({name: "Anushka", age: 20, email: "anushka@example.com"})
})

// example of POST request handler
app.post('/user', (req, res) => {
  res.send("User created successfully")
})

// example of DELETE request handler
app.delete('/user', (req, res) => {
  res.send("User deleted successfully")
})

// example of PUT request handler
app.put('/user', (req, res) => {
  res.send("User updated successfully")
})

// example of PATCH request handler
app.patch('/user', (req, res) => {
  res.send("User updated successfully")
})

// order of the routes matter, so if you have a route that matches a specific path, it should be defined before a more general route. Otherwise, the general route will catch the request and the specific route will never be reached.
app.use("/test", (req, res) => { // request handler
  res.send("Hello from the server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


