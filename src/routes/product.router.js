const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')

const upload = require('../config/multerConfig');

const ROLES = require("../utils/roles.util");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); 


router.get('/list',authMiddleware ,productController.getProductForList);
router.get('/new', authMiddleware,productController.getNewProducts);
router.get('/:id',authMiddleware,productController.getProductById);
router.get('/',authMiddleware,productController.getAllProducts);
router.post('/',authMiddleware,roleMiddleware(ROLES.ADMIN),upload.single('productImage'),productController.addProduct);
router.put('/:id',authMiddleware,roleMiddleware(ROLES.ADMIN),upload.single('productImage'),productController.updateProduct);
router.delete('/:id',authMiddleware,roleMiddleware(ROLES.ADMIN),productController.deleteProduct);


module.exports = router;