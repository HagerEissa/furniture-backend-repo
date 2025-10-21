const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favourite.controller')


router.get('/:userId',favouriteController.getFavouriteForUser);
router.post('/add',favouriteController.addToFavourite);
router.delete('/:userId/:productId',favouriteController.deleteFromFavourite);
router.delete('/clear/:userId',favouriteController.clearFavourite);

module.exports = router;