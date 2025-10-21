const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller')

const upload = require('../config/multerConfig');


router.get('/:id',categoryController.getCategoryById);
router.get('/',categoryController.getAllCategories);
router.post('/',upload.single('categoryImage'),categoryController.addCategory);
router.put('/:id',upload.single('categoryImage'),categoryController.updateCategory);
router.delete('/:id',categoryController.deleteCategory);




module.exports = router;