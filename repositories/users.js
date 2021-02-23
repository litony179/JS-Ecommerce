const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const repositories = require('./repositories');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends repositories {
    async create(attributes) {
        // {email: '', password: ''}

        attributes.id = this.randomID();
        const salt = crypto.randomBytes(8).toString('hex');

        const buf = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${buf.toString('hex')}.${salt}`
        };

        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async comparePassword(saved, supplied) {
        //saved = password saved in our database
        //supplied = password supplied by the client
        const result = saved.split('.');
        const hashed = result[0];
        const salt = result[1];
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');

    }
}

module.exports = new usersRepository('users.json');