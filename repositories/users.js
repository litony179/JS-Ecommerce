const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("creating a new repository requires a file")
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
        return JSON.parse(contents);
    }

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

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomID() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const getRecords = await this.getAll();
        return getRecords.find((record) => record.id === id);
    }

    async delete(id) {
        const getRecords = await this.getAll();
        const filteredRecords = getRecords.filter((record) => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        const getRecords = await this.getAll();
        const records = getRecords.find((record) => record.id === id);

        if (!records) {
            throw new Error('ID ${id} not found');
        }

        Object.assign(records, attributes);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const getRecords = await this.getAll();

        for (let record of getRecords) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found === true) {
                return record;
            }
        }
    }
}

module.exports = new usersRepository('users.json');