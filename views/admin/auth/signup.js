const layout = require('../layout');

function getError(errors, propertyName) {
    if (errors) {
        return errors.mapped()[propertyName].msg;
    }
}
module.exports = ({ req, errors }) => {

    return layout({
        content: `
            <div>
                Your ID is : ${req.session.userID}
                <form method="POST">
                    <input name="email" placeholder="email">
                    <input name="password"placeholder="password">
                    <input name="passwordConfirmation"  placeholder="password-confirmation">
                    <button>Sign up</button>
                </form>
            </div>
        `
    });
};