const productModel = require('../models/product.model')

//getAllProducts
exports.getAllProducts=async(req,res)=>{
    try{
        const products = await productModel.find().populate('categoryId');
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

//getProductById
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

//createProduct
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

//updateProduct
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

//deleteProduct
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

//getNewProducts
exports.getNewProducts=async(req,res)=>{
    try{
        const products = await productModel.find({isnew:true})
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

//getProductForList for pagination , sort ,filter
exports.getProductForList = async (req, res) => {
    try {
        let { searchTerm, categoryId, sortBy, sortOrder, page, pageSize } = req.query;

        // Default values
        sortBy = sortBy || 'price';
        sortOrder = sortOrder === 'asc' ? 1 : -1;
        page = Number(page) || 1;
        pageSize = Number(pageSize) || 10;

        let queryFilter = {};

        //filter by searchTerm
        if (searchTerm && searchTerm !== 'null') {
            queryFilter.$or = [// The regex pattern ensures it finds partial matches
                { name: { $regex: ".*" + searchTerm + ".*", $options: 'i' } },
                { desc: { $regex: ".*" + searchTerm + ".*", $options: 'i' } }
            ];
        }
        //filter by categoryId
        if (categoryId && categoryId !== 'null') {
            queryFilter.categoryId = categoryId;
        }

        // find products
        const products = await productModel.find(queryFilter)
            .sort({ [sortBy]: +sortOrder })  
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
