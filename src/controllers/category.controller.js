const categoryModel = require('../models/category.model');


// getAllCategories
exports.getAllCategories = async(req,res)=>{
    try{
        const categories = await categoryModel.find();
        res.status(200).json(categories);
    }catch(err){
        res.status(500).json({error:err.message});

    }
}

//getCategoryById
exports.getCategoryById = async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id);
        if(!category){
            return res.status(404).json({ message: 'category not found' });
        }
        res.status(200).json(category);
    }catch(err){
        res.status(500).json({error:err.message});

    }
}

// createCategory
exports.addCategory = async(req,res)=>{
    try{
        req.body.imgURL = req.file.path;
        if(!req.body.name) return res.status(400).json({ message: "Name is required" });
        const category = await categoryModel.create(req.body);
        res.status(201).json(category);
    }catch(err){
        res.status(500).json({error:err.message});

    }
}

//updateCategory
exports.updateCategory = async(req,res)=>{
    try{
        if(req.file){
            req.body.imgURL = req.file.path;
        }
        const updatedData = req.body;        
        const category = await categoryModel.findByIdAndUpdate(req.params.id,updatedData,{new:true})
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

//deleteCategory
exports.deleteCategory = async(req,res)=>{
    try{
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


