const ProductModel = require('../models/productModel')
const CategoryModel = require('../models/categoryModel')
const { default: mongoose } = require("mongoose");

//*******************VALIDATIONS*********************/

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

//****************** CREATE PRODUCT********************/

const createProduct = async function (req, res) {


    try {

        const queryParams = req.query
        const requestBody = req.body

        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" })
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide input data" });
        }

        const { name, categoryName, description } = requestBody

        if (!isValid(name)) {
            return res
                .status(400)
                .send({ status: false, message: "Name must be provided" });
        }

        if (!isValid(categoryName)) {
            return res
                .status(400)
                .send({ status: false, message: "category name must be provided" })
        }

        if (!isValid(description)) {
            return res
                .status(400)
                .send({ status: false, message: "description must be provided" });
        }

        const categoryByCategoryName = await CategoryModel.findOne({ name: categoryName })

        if (!categoryByCategoryName) {
            return res
                .status(404)
                .send({ status: false, message: `no category found by this name: ${categoryName}` })
        }

        const categoryId = categoryByCategoryName._id

        requestBody.categoryId = categoryId

        delete requestBody.categoryName

        const newProduct = await ProductModel.create(requestBody)

        res
            .status(201)
            .send({ status: true, message: "new intern entry done", data: newProduct })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}

//**************************GET PRODUCTS DETAILS********************** */

const getProductDetails = async function (req, res) {

    try {

        const requestBody = req.body
        const queryParams = req.query;

        if (isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" })
        }

        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }


        const productDetails = await ProductModel.find({ isDeleted: false })

        if (productDetails.length == 0) {
            return res
                .status(404)
                .send({ status: false, message: "No product found" });
        }

        res
            .status(200)
            .send({ status: true, data: productDetails })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}

//*****************************UPDATING A PRODUCT*************************/

const updateProduct = async function (req, res) {
    try {

        const productId = req.params["productId"]
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
                .send({ status: false, message: "product details are required for update" })
        }

        if (!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid productId" })
        }

        const productByProductID = await ProductModel.findOne({
            _id: productId,
            isDeleted: false
        });

        if (!productByProductID) {
            return res
                .status(404)
                .send({ status: false, message: `no product found by ${productId}` });
        }

        //using destructuring then validating selected keys by user
        const { name, categoryName, description } = requestBody;

        const update = {
            $set: {}
        };

        if (requestBody.hasOwnProperty("name")) {
            if (!isValid(name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "name should be in valid format" });
            }
            update.$set["name"] = name.trim();
        }

        if (requestBody.hasOwnProperty("categoryName")) {

            if (!isValid(categoryName)) {
                return res
                    .status(400)
                    .send({ status: false, message: "name should be in valid format" });
            }

            const categoryByCategoryName = await CategoryModel.findOne({ name: categoryName })

            if (!categoryByCategoryName) {
                return res
                    .status(404)
                    .send({ status: false, message: `no category found by this name: ${categoryName}` })
            }

            const categoryId = categoryByCategoryName._id


            update.$set["categoryId"] = categoryId;
        }

        if (requestBody.hasOwnProperty("description")) {
            if (!isValid(description)) {
                return res
                    .status(400)
                    .send({ status: false, message: "description should be in valid format" });
            }
            update.$set["description"] = description.trim();
        }

        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: productId, isDeleted: false },
            update,
            { new: true }
        )

        res
            .status(200)
            .send({ status: true, message: "product updated successfully", data: updatedProduct });

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}

//**************************DELETING A PRODUCT*********************** */

const deleteProduct = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;
        const productId = req.params.productId;

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

        if (!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: `${id} is not a valid ProductID` });
        }

        const productByproductId = await ProductModel.findOne({
            _id: productId,
            isDeleted: false
        })

        if (!productByproductId) {
            return res
                .status(404)
                .send({ status: false, message: `no product found by ${productId}` })
        }

        await ProductModel.findByIdAndUpdate(
            { _id: productId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        res
            .status(200)
            .send({ status: true, message: "product sucessfully deleted" });

    } catch (error) {

        res.status(500).status({ status: false, message: error.message })

    }
}


module.exports.createProduct = createProduct
module.exports.getProductDetails = getProductDetails
module.exports.updateProduct = updateProduct
module.exports.deleteProduct = deleteProduct



