const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show')

const router = express.Router();

// Recieve a post request to add an item to cart
router.post('/cart/products', async(req, res) => {
    //Figure out whether the user has a cart or not
    let cart;
    if (!req.session.cartsId) {
        //create cart and store cartID
        cart = await cartsRepo.create({ items: [] });
        req.session.cartsId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartsId);
    }

    const existingItem = cart.items.find((item) => item.id === req.body.productID);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productID, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    })

    res.redirect('/cart');
});

// Recieve a get request to show all items in a cart
router.get('/cart', async(req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartsId);
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }
    res.send(cartShowTemplate({ items: cart.items }));
});

// Recieve a post request to delete an item in a cart
router.post('/cart/products/delete', async(req, res) => {
    const { itemID } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartsId);
    const items = cart.items.filter((item) => item.id !== itemID);

    await cartsRepo.update(req.session.cartsId, { items });

    res.redirect('/cart');
});

module.exports = router;