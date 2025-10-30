const mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    shortDesc:{
        type:String,
    }
    ,price:{
        type: Number,
        min: 0
    }
    ,discount:{
        type:Number,
        default:0
    },
    imgURL:{
        type:String,
        required:true,
    },
    categoryId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'categories',
            required:true,
        },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0    
    },
    isnew:{
        type:Boolean,
        default:false
    },
    reviewId: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviews',
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    },{
        timestamps:true
    })


//MODEL ->instance                      'products'-> name of collection in database
module.exports = mongoose.model('products',productSchema)


