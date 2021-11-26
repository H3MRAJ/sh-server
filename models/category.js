const mongoose=(require('mongoose'));

const categorySchema = mongoose.Schema(
    {
        //creating Schema
        name:{
            type: String,
            required:true
        },
        icon:{
            type: String,

        },
        color:{
            type: String,
        },
        
    }
)

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});
//creating model
exports.Category= mongoose.model('Category',categorySchema);