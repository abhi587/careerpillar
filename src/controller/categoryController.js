const CategoryModel = require('../models/categoryModel')
const ProductModel = require('../models/productModel')
const { default: mongoose } = require("mongoose");

//****************Validation******************** */

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
} 

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
};

//***************************CREATE CATEGORY**********************************/

const createCategory = async function (req, res) {
    try {

        const queryParams = req.query
        const requestBody = req.body

        if(isValidRequestBody(queryParams)){
            return res
                .status(400)
                .send({status:false , message:"invalid request"})
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide category data" })
        }

        const { name, description } = requestBody

        if(Object.keys(requestBody).length > 2){
            return res
                .status(400)
                .send({status:false , message: "invalid data entered inside request body"})
        }

        if (!isValid(name)) {
            return res
                .status(400)
                .send({ status: false, message: "Name is required" })
        }

        if (!isValid(description)) {
            return res
                .status(400)
                .send({ status: false, message: "Discription is required" })
        }

        const newCategory = await CategoryModel.create(requestBody)

        res
            .status(201)
            .send({ status: true, message: "new category created", data: newCategory })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}

//**************************GET CATEGORY DETAILS********************** */

const getCategoryDetails = async function (req, res) {

    try {

        const requestBody = req.body
        const queryParams = req.query;
        const categoryName = queryParams.categoryName

        if(isValidRequestBody(requestBody)){
            return res
                .status(400)
                .send({status:false , message: "invalid request"})
        }

        if (!isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide inputs for getting category details" });
        }

        if (!isValid(categoryName)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide categoryName" })
        }

        const categoryByCategoryName = await CategoryModel.findOne({ name: categoryName, isDeleted: false })

        if (!categoryByCategoryName) {
            return res
                .status(404)
                .send({ status: false, message: "Invalid CategoryName" });
        }

        const categoryID = categoryByCategoryName._id

        const getProductByCategoryID = await ProductModel.find({ categoryId: categoryID, isDeleted: false })

        const { name, description} = categoryByCategoryName

        const data = {
            name: name,
            description : description,
            products: getProductByCategoryID
        }

        res
            .status(200)
            .send({ status: true, data: data })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}

//*****************************UPDATING A CATEGORY*************************/

const updateCategory = async function (req, res) {
    try {

        const categoryId = req.params["categoryId"]
        const requestBody = req.body;
        const queryParams = req.query;

        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" })
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "category details are required for update" })
        }

        if (!isValidObjectId(categoryId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid categoryId" })
        }

        const categoryByCategoryID = await CategoryModel.findOne({
            _id: categoryId,
            isDeleted: false
        });

        if (!categoryByCategoryID) {
            return res
                .status(404)           
                .send({ status: false, message: `no category found by ${categoryId}` });
        }

        //using destructuring then validating selected keys by user
        const { name, description} = requestBody;

        const update = {
            $set: { }
        };

        if (requestBody.hasOwnProperty("name")) {
            if (!isValid(name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "name should be in valid format" });
            }
            update.$set["name"] = name.trim();
        }

        if (requestBody.hasOwnProperty("description")) {
            if (!isValid(description)) {
                return res
                    .status(400)
                    .send({ status: false, message: "description should be in valid format" });
            }
            update.$set["description"] = description.trim();
        }

        const updatedcategory = await CategoryModel.findOneAndUpdate(
            { _id: categoryId, isDeleted: false},
            update,
            { new: true }
        )

        res
            .status(200)
            .send({ status: true, message: "category updated successfully", data: updatedcategory });

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}

//**************************DELETING A CATEGORY*********************** */

const deleteCategory = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;
        const categoryId = req.params.categoryId;

        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid Request" });
        }

        if (isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid Request" });
        }

        if (!isValidObjectId(categoryId)) {
            return res
                .status(400)
                .send({ status: false, message: `${id} is not a valid CategoryID` });
        }

        const categoryByCategoryId = await CategoryModel.findOne({
            _id: categoryId,
            isDeleted: false
        })

        if (!categoryByCategoryId) {
            return res
                .status(404)
                .send({ status: false, message: `no category found by ${categoryId}` })
        }

        await CategoryModel.findByIdAndUpdate(
            { _id: categoryId },
            { $set: { isDeleted: true} },
            { new: true }
        );

        res
            .status(200)
            .send({ status: true, message: "category sucessfully deleted" });

    } catch (error) {

        res.status(500).status({ status: false, message: error.message })

    }
}


module.exports.createCategory = createCategory
module.exports.getCategoryDetails = getCategoryDetails
module.exports.updateCategory = updateCategory
module.exports.deleteCategory = deleteCategory
