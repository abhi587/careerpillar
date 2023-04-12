const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true, "name is required"],
        trim : true
    },
    categoryId : {
        type : ObjectId,
        ref : "Category"
    },
    description : {
        type: String, 
        required : [true, "description is required"],
        trim : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }

},{timestamps : true})


module.exports = mongoose.model('Product',productSchema)