const expressValidator = require('express-validator');

module.exports = {
    handleErrors(templateFunction, dataCb) {
        return async(req, res, next) => {
            const errors = expressValidator.validationResult(req);
            if (!errors.isEmpty()) {
                let data = {};
                if (dataCb) {
                    data = await dataCb(req);
                }
                return res.send(templateFunction({ errors, ...data }));
            }

            next();
        };
    },

    requireAuth(req, res, next) {
        if (!req.session.userID) {
            return res.redirect('/signin');
        }

        next();
    }
}