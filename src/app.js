// creating Express.js Server
const express = require('express');
const app = express()
const port = 7777

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use("/test", (req, res) => { // request handler
  res.send("Hello from the server");
});

app.use("/hello", (req, res) => { // request handler
  res.send("Hello jiii");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


