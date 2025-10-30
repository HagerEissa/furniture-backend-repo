const favouriteModel = require('../models/favourite.model');
const productModel = require('../models/product.model');

exports.addToFavourite=async(req,res)=>{
    try{
        const {userId,productId} = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let favourite = await favouriteModel.findOne({userId});
        if(!favourite){
            favourite = new favouriteModel({
                userId,
                products:[{productId}]
            })
        }else{
            const productExist = favourite.products.find(p=>p.productId.toString()===productId);
            if (productExist) {
                return res.status(400).json({ message: 'Product already in favourites' });
            }
            favourite.products.push({ productId });
        }
        
        await favourite.save();
        res.status(201).json(favourite);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

exports.getFavouriteForUser=async(req,res)=>{
    try{
        const {userId} = req.params;
        const favourite = await favouriteModel.findOne({userId}).populate('products.productId');
        if (!favourite) {
            return res.status(404).json({ message: 'No favourites found' });
        }
        res.status(200).json(favourite);

    }catch(err){
        res.status(500).json({error:err.message});
    }
}




exports.deleteFromFavourite=async(req,res)=>{
    try{
        const {userId,productId} = req.params;
        const favourite = await favouriteModel.findOne({userId});
        if (!favourite) {
            return res.status(404).json({ message: 'No favourites found' });
        }
        const favProduct =favourite.products.findIndex(p=>p.productId.toString() === productId);
        if (favProduct === -1) {
            return res.status(404).json({ message: 'Product not found in favourites' });
        }
        favourite.products.splice(favProduct,1);
        await favourite.save();
        res.status(200).json({ message: 'Product removed from favourites', favourite });
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.clearFavourite=async(req,res)=>{
    try{
        const {userId} = req.params;
        const favourite = await favouriteModel.findOne({userId});
        if (!favourite) {
            return res.status(404).json({ message: 'No favourites found' });
        }
        favourite.products=[]
        await favourite.save();
        res.status(200).json({ message: 'All favourites cleared', favourite });
    }catch(err){
        res.status(500).json({error:err.message});
    }
}