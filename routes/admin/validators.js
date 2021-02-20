const expressValidator = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail: expressValidator.check('email').trim().normalizeEmail().isEmail().custom(async(email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
            throw new Error('Email already in use')
        }
    }),
    requirePassword: expressValidator.check('password').trim().isLength({ min: 4, max: 20 }),
    requirePasswordConfirmation: expressValidator.check('passwordConfirmation').trim().isLength({ min: 4, max: 20 }).custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
            throw new Error('passwords does not match');
        }
    })

}