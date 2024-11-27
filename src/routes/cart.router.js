const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCart);
router.post('/:cid/products/:pid', cartController.addProductToCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
router.delete('/:cid', cartController.clearCart);

module.exports = router;