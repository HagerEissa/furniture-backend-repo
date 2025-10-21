const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')

const upload = require('../config/multerConfig');

router.get('/list', productController.getProductForList);
router.get('/new', productController.getNewProducts);
router.get('/:id',productController.getProductById);
router.get('/',productController.getAllProducts);
router.post('/',upload.single('productImage'),productController.addProduct);
router.put('/:id',upload.single('productImage'),productController.updateProduct);
router.delete('/:id',productController.deleteProduct);


module.exports = router;