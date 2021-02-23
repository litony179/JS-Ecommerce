const Repositories = require('./repositories');
const { getAll } = require('./users');

class productsRepository extends Repositories {

}

module.exports = new productsRepository('products.json')