const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favourite.controller')


router.get('/:userId',favouriteController.getFavouriteForUser);
router.post('/add',favouriteController.addToFavourite);
router.delete('/clear/:userId',favouriteController.clearFavourite);

router.delete('/:userId/:productId',favouriteController.deleteFromFavourite);

module.exports = router;