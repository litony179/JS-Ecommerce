const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// Recieve a post request to add an item to cart
router.post('/cart/products', async(req, res) => {
    //Figure out whether the user has a cart or not
    let cart;
    if (!req.session.cartId) {
        //need to create one
        // store cartId to the req.session.cartId property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;

    } else {
        //We have a cart, retrieve from repo
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find((item) => item.id === req.body.productID);
    if (existingItem) {
        //increment
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productID, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    })

    //Either increment a product or add a new product
    res.send('product added to cart');
});

// Recieve a get request to show all items in a cart

// Recieve a post request to delete an item in a cart

module.exports = router;