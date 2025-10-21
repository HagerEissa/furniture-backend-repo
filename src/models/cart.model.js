const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users',   //waite sandy
                required:true,
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products',   
                required:true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            }
        }
    ],
    totalPrice:{
        type:Number,
        default:0
    }
}, {
  timestamps: true
})


//MODEL ->instance                      'carts'-> name of collection in database
module.exports = mongoose.model('carts',cartSchema)
