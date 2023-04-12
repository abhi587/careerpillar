const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Name is required"],
        trim : true 
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
},{timestamps: true})


module.exports = mongoose.model("Category",categorySchema);