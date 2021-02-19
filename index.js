//Express JS is a backend application framework for Node.js
const express = require('express');
const processRequest = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
app.use(processRequest.urlencoded({ extended: true }));

app.use(cookieSession({
    keys: ['asrgfsfvasergasdvdxfbvsrtes']
}));

// req = request
// res = response
// In this code snippet, when somebody makes an network request, this gets called and responds (res) with "hi there!" and sends it back to the user who made that request.
// app.get means that express.js is waiting for incoming requests that have a METHOD of GET.
// "/" means to also look for the "/" in the path
// method="post" creates a record in our database of the form info
app.get('/signup', (req, res) => {
    res.send(`
        <div>
            Your ID is : ${req.session.userID}
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password"placeholder="password">
                <input name="passwordConfirmation"  placeholder="password-confirmation">
                <button>Sign up</button>
            </form>
        </div>
    `);
});

//middle ware function to process data on request
// function processDataRequest(req, res, next) {
//     if (req.method === 'POST') {
//         req.on('data', (data) => {
//             const parsed = data.toString('utf-8').split('&');
//             console.log(parsed);
//             const recordData = {};
//             for (let i = 0; i < parsed.length; i++) {
//                 const [key, value] = parsed[i].split('=');
//                 recordData[key] = value;
//                 console.log(recordData);
//             }
//             req.body = recordData;
//             next();
//         });
//     } else {
//         next();
//     }
// }
app.post('/signup', async(req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('password ar  not matching');
    }

    //create a user inside the users repo
    const user = await usersRepo.create({
        email,
        password
    });

    //store id using library
    //added by cookie-session
    req.session.userID = user.id;




    //Getting access to email, password and passwordConfirmation
    res.send("account Created");
});


app.get('/signout', (req, res) => {
    req.session = null;
    res.send('you are logged out');
});

app.get('/signin', (req, res) => {
    res.send(`
        <div>  
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password"placeholder="password">
                <button>Sign up</button>
            </form>
        </div>
    `);
});

app.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send("email not found");
    }

    if (user.password !== password) {
        return res.send("invalid password");
    }

    req.session.userID = user.id;
    res.send('you are signed in');
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


// DATA STORAGE
// Not suitable for production code
// This this because there three major flaws with this DATA STORAGE implimentation.
// A fun project
// #1. it'll spit out a error of we read/write to the same file twice
// #2. It'll spit out an error if multiple servers on different machines
// #3. we'll have to write to the database every time we need to updates