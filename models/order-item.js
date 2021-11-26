const mongoose=(require('mongoose'));

const orderItemSchema = mongoose.Schema(
    {
        //creating Schema
    quantity: {type: Number, required: true},
    product:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
    },
    }
)

//creating model
exports.OrderItem= mongoose.model('OrderItem',orderItemSchema);