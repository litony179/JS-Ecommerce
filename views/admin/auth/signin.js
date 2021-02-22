const layout = require('../layout');

const { getError } = require('../../helper');

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