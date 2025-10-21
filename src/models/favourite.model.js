const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users', //wait sandy
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


//MODEL ->instance                      'favourites'-> name of collection in database
module.exports = mongoose.model('favourites',favouriteSchema)


