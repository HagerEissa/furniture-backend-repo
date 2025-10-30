const productModel = require('../models/product.model')

exports.getAllProducts=async(req,res)=>{
    try{
        const products = await productModel.find().populate('categoryId');
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

exports.getProductById= async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id);
        if(!product){
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

exports.addProduct=async(req,res)=>{
    try{
        const { name, desc,categoryId,stock } = req.body;

        if (!name || !desc ||!req.file ||!categoryId) {
            return res.status(400).json({ message: 'Name , desc , image and category are required' });
        }
        req.body.imgURL = req.file.path;
        const product = await productModel.create(req.body);
        res.status(201).json(product);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.updateProduct=async(req,res)=>{
    try{
        if(req.file){
            req.body.imgURL = req.file.path;
        }
        const updatedData = req.body;
        const product = await productModel.findByIdAndUpdate(req.params.id,updatedData,{new:true})
        if(!product){
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.deleteProduct=async(req,res)=>{
    try{
        const product = await productModel.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.getNewProducts=async(req,res)=>{
    try{
        const products = await productModel.find({isnew:true})
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.getProductForList = async (req, res) => {
    try {
        let { searchTerm, categoryId, sortBy, sortOrder, page, pageSize } = req.query;

        sortBy = sortBy || 'price';
        sortOrder = sortOrder === 'asc' ? 1 : -1;
        page = Number(page) || 1;
        pageSize = Number(pageSize) || 10;

        let queryFilter = {};

        if (searchTerm && searchTerm !== 'null') {
            queryFilter.$or = [
                { name: { $regex: ".*" + searchTerm + ".*", $options: 'i' } },
                { desc: { $regex: ".*" + searchTerm + ".*", $options: 'i' } }
            ];
        }

        if (categoryId && categoryId !== 'null') {
            queryFilter.categoryId = categoryId;
        }

        const products = await productModel.find(queryFilter)
            .sort({ [sortBy]: +sortOrder })  
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
