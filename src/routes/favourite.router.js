const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favourite.controller')

const ROLES = require("../utils/roles.util");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); 


router.get('/:userId',authMiddleware,roleMiddleware(ROLES.USER),favouriteController.getFavouriteForUser);
router.post('/add',authMiddleware,roleMiddleware(ROLES.USER),favouriteController.addToFavourite);
router.delete('/clear/:userId',roleMiddleware(ROLES.USER),authMiddleware,favouriteController.clearFavourite);
router.delete('/:userId/:productId',roleMiddleware(ROLES.USER),authMiddleware,favouriteController.deleteFromFavourite);

module.exports = router;