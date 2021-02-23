const express = require('express');
const multer = require('multer');

const expressValidator = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const validators = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', upload.single('image'), [
    validators.requireTitle,
    validators.requirePrice
], async(req, res) => {
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(productsNewTemplate({ errors }));
    }

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image })

    res.send('submitted')
});



module.exports = router;