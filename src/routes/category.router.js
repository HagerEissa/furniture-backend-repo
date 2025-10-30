const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller')

const upload = require('../config/multerConfig');
const ROLES = require("../utils/roles.util");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); 


router.get('/:id',authMiddleware,categoryController.getCategoryById);
router.get('/',authMiddleware,categoryController.getAllCategories);
router.post('/',authMiddleware,roleMiddleware(ROLES.ADMIN),upload.single('categoryImage'),categoryController.addCategory);
router.put('/:id',authMiddleware,roleMiddleware(ROLES.ADMIN),upload.single('categoryImage'),categoryController.updateCategory);
router.delete('/:id',authMiddleware,roleMiddleware(ROLES.ADMIN),categoryController.deleteCategory);




module.exports = router;