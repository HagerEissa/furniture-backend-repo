const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users', 
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products',
                required:true
            }
        }
    ]
}, {
    timestamps: true
})


module.exports = mongoose.model('favourites',favouriteSchema)


