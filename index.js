//Express JS is a backend application framework for Node.js
const express = require('express');
const app = express();

// req = request
// res = response
// In this code snippet, when somebody makes an network request, this gets called and responds (res) with "hi there!" and sends it back to the user who made that request.
// app.get means that express.js is waiting for incoming requests that have a METHOD of GET.
// "/" means to also look for the "/" in the path
app.get('/', (req, res) => {
    res.send('hey there!');
});

// Starts listening to requests in this port
// Host: the domain that is called
// port:
// /: the path to our code
// METHOD: the actions that you want to do with your request
// localhost: a domain that is locally hosted on your computer
app.listen(3000, () => {
    console.log('listening...');
});