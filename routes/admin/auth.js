const express = require('express');
const expressValidator = require('express-validator');


const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const validators = require('./validators');

const router = express.Router();

// req = request
// res = response
// In this code snippet, when somebody makes an network request, this gets called and responds (res) with "hi there!" and sends it back to the user who made that request.
// app.get means that express.js is waiting for incoming requests that have a METHOD of GET.
// "/" means to also look for the "/" in the path
// method="post" creates a record in our database of the form info
router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
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
router.post('/signup', [
    validators.requireEmail,
    validators.requirePassword,
    validators.requirePasswordConfirmation
], async(req, res) => {
    const errors = expressValidator.validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.send(signUpTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;

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


router.get('/signout', (req, res) => {
    req.session = null;
    res.send('you are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signInTemplate({}));
});

router.post('/signin', [
    validators.requireEmailExists,
    validators.requireValidPasswordForUser
], async(req, res) => {
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(signInTemplate({ errors }))
    }

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });


    req.session.userID = user.id;
    res.send('you are signed in');
});

module.exports = router;