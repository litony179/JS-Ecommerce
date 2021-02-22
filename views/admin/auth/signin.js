const layout = require('../layout');

function getError(errors, propertyName) {
    try {
        return errors.mapped()[propertyName].msg;

    } catch (err) {
        return '';
    }
}

module.exports = ({ errors }) => {
    return layout({ content: `
        <div>  
            <form method="POST">
                <input name="email" placeholder="email">
                ${getError(errors, 'email')}
                <input name="password"placeholder="password">
                ${getError(errors, 'password')}
                <button>Sign up</button>
            </form>
        </div>
    ` });
};