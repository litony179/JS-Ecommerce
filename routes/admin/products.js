const express = require('express');
const multer = require('multer');

const handleErrors = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplates = require('../../views/admin/products/index');
const productsEditTemplates = require('../../views/admin/products/edit');
const validators = require('./validators');



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin/products', handleErrors.requireAuth, async(req, res) => {

    const products = await productsRepo.getAll();
    res.send(productsIndexTemplates({ products }));

});

router.get('/admin/products/new', handleErrors.requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', handleErrors.requireAuth, upload.single('image'), [
    validators.requireTitle,
    validators.requirePrice
], handleErrors.handleErrors(productsNewTemplate), async(req, res) => {

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image })

    res.redirect('/admin/products');
});


router.get('/admin/products/:id/edit', handleErrors.requireAuth, async(req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send('Product not found');
    }

    res.send(productsEditTemplates({ product }));
});


router.post('/admin/products/:id/edit',
    handleErrors.requireAuth,
    upload.single('image'), [validators.requireTitle, validators.requirePrice],
    handleErrors.handleErrors(productsEditTemplates, async(req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async(req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try {
            await productsRepo.update(req.params.id, changes);
        } catch (err) {
            return res.send('Could not find item');
        }

        res.redirect('/admin/products');

    }
);

router.post('/admin/products/:id/delete', handleErrors.requireAuth, async(req, res) => {
    await productsRepo.delete(req.params.id);

    res.redirect('/admin/products');
});

module.exports = router;