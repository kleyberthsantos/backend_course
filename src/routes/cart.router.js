const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const cartController = new CartController();

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
router.delete('/:cid', cartController.clearCart);

module.exports = router;