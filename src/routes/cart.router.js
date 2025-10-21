const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller')


router.get('/:userId',cartController.getCartForUser);
router.post('/add',cartController.addToCart);
router.delete('/:userId/:productId',cartController.deleteProductFromCart);
router.put('/:userId/:productId',cartController.updateQuantity);
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;