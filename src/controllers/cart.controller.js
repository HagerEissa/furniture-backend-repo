const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model')

exports.getCartForUser = async(req,res)=>{
    try{
        const { userId } = req.params;
        const cart = await cartModel.findOne({userId}).populate('products.productId')
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json({error:err.message});

    }
}



exports.addToCart = async(req,res)=>{
    try{
        const {userId,productId,quantity}= req.body;
        let cart =await cartModel.findOne({ userId });
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (quantity > product.stock) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }
        if (product.stock<=0) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }
        const finalPrice = product.price * (1 - product.discount / 100);
        if (!cart) { 
            cart = new cartModel({
            userId,
            products: [{ productId, quantity }],
            totalPrice: finalPrice * quantity
            });
        }else{ 
            const productInCart = cart.products.find(
                (p) => p.productId.toString() === productId
            );
            if(productInCart){
                if (productInCart.quantity + quantity > product.stock) {
                    return res.status(400).json({ message: 'Not enough stock for this quantity' });
                }
                productInCart.quantity+=quantity;
                cart.totalPrice += finalPrice *quantity;
            }else{
                cart.products.push({ productId, quantity });
                cart.totalPrice += finalPrice * quantity;
            }
        }
        product.stock-=quantity
        await product.save();
        await cart.save();
        res.status(201).json(cart);
    }catch(err){
        res.status(500).json({error:err.message});

    }
}


exports.deleteProductFromCart = async(req,res)=>{
    try{
        const {userId,productId}=req.params;
        const cart = await cartModel.findOne({userId})
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productIndex  = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );

        if(productIndex === -1){
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = await productModel.findById(productId);
        const finalPrice = product.price * (1 - product.discount / 100);
        if (product) {
            const quantity = cart.products[productIndex].quantity;
            cart.totalPrice -= finalPrice * quantity;
            product.stock += quantity
            await product.save();
        }

        cart.products.splice(productIndex, 1);

        await cart.save();

        res.status(200).json({
        message: 'Product removed from cart successfully',
        cart,
        });

    }catch(err){
        res.status(500).json({error:err.message});
    }
}


exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ userId });
    if (!cart){
        return res.status(404).json({ message: 'Cart not found' });
    }

    const productInCart = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (!productInCart){
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    const product = await productModel.findById(productId);
    if (!product){
        return res.status(404).json({ message: 'Product not found' });
    }
    const finalPrice = product.price * (1 - product.discount / 100);
    cart.totalPrice -= finalPrice * productInCart.quantity;

    if(quantity>product.stock){
        return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }
    const oldQuantity = productInCart.quantity
    product.stock+=oldQuantity
    productInCart.quantity = quantity;
    product.stock-=quantity
    cart.totalPrice += finalPrice * quantity;
    await product.save();
    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartModel.findOne({ userId });
    if (!cart){
        return res.status(404).json({ message: 'Cart not found' });
    }
     for (const obj of cart.products) {
        const product = await productModel.findById(obj.productId);
        product.stock += obj.quantity;
        await product.save();
     }

    cart.products = [];
    cart.totalPrice = 0;
    
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
