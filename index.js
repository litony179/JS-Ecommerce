//Express JS is a backend application framework for Node.js
const express = require('express');
const processRequest = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();
app.use(processRequest.urlencoded({ extended: true }));

app.use(cookieSession({
    keys: ['asrgfsfvasergasdvdxfbvsrtes']
}));

app.use(authRouter);



// Starts listening to requests in this port
// Host: the domain that is called
// port:
// /: the path to our code
// METHOD: the actions that you want to do with your request
// localhost: a domain that is locally hosted on your computer
app.listen(3000, () => {
    console.log('listening...');
});


// DATA STORAGE
// Not suitable for production code
// This this because there three major flaws with this DATA STORAGE implimentation.
// A fun project
// #1. it'll spit out a error of we read/write to the same file twice
// #2. It'll spit out an error if multiple servers on different machines
// #3. we'll have to write to the database every time we need to updates