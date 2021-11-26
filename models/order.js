
   
const mongoose = (require('mongoose'));

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);



/**
Order Example:
{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "616be9f9e932b6e3845e506f"
        },
        {
            "quantity": 2,
            "product" : "616beda84ea633a93cd0a3ad"
        }
    ],
    "shippingAddress1" : "E204, Skyline",
    "shippingAddress2" : "Dwarka Nagar",
    "city": "Bangalore",
    "zip": "560085",
    "country": "India",
    "phone": "7277562447",
    "user": "6186bfab378e82cace43f0d4"
}
 */