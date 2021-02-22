const layout = require('../layout');

const { getError } = require('../../helper');

module.exports = ({ req, errors }) => {

    return layout({
        content: `
            <div>
                Your ID is : ${req.session.userID}
                <form method="POST">
                    <input name="email" placeholder="email">
                    ${getError(errors, 'email')}
                    <input name="password"placeholder="password">
                    ${getError(errors, 'password')}
                    <input name="passwordConfirmation"  placeholder="password-confirmation">
                    ${getError(errors, 'passwordConfirmation')}
                    <button>Sign up</button>
                </form>
            </div>
        `
    });
};