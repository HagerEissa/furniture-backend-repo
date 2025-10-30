const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller')

const ROLES = require("../utils/roles.util");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); 


router.get('/:userId',authMiddleware,roleMiddleware(ROLES.USER),cartController.getCartForUser);
router.post('/add',authMiddleware,roleMiddleware(ROLES.USER),cartController.addToCart);
router.delete('/:userId/:productId',authMiddleware,roleMiddleware(ROLES.USER),cartController.deleteProductFromCart);
router.put('/:userId/:productId',authMiddleware,roleMiddleware(ROLES.USER),cartController.updateQuantity);
router.delete('/clear/:userId', authMiddleware,roleMiddleware(ROLES.USER),cartController.clearCart);

module.exports = router;