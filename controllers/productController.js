const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../config/errors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

//*************** Create product ***************/
const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({
        message: "Success",
        product: product
    });
}

//*************** Get all products *****************/
const getAllProducts = async (req, res) => {
    console.log(name);
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: products.length,
        products: products
    });
}

//*************** Get single product *****************/
const getSingleProduct = async (req, res) => {
    console.log(req.params.id);
    const { id: productId } = req.params;

    //? using virtuals to map all reviews for the product, then mapping all user who reviewed using populate
    const product = await Product.findOne({ _id: productId })
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'name'
            }
        });


    if (!product) {
        throw new NotFoundError(`No product with id ${productId}`)
    }

    res.status(StatusCodes.OK).json({
        message: "Success",
        product: product
    });
}

//*************** Update product *****************/
const updateProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, { new: true, runValidators: true });

    if (!product) {
        throw new NotFoundError(`No product with id ${productId}`)
    }

    res.status(StatusCodes.OK).json({
        message: "Success",
        product: product
    });

}

//*************** Delete product *****************/
const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
        throw new NotFoundError(`No product with id ${productId}`)
    }

    //? using remove so that we can use the 'pre' middleware to delete its associated reviews
    await product.remove();
    res.status(StatusCodes.OK).json({
        message: "Success"
    });

}

//*************** Upload product image locally on server ****************/
const uploadImageLocal = async (req, res) => {
    if (!req.files) {
        throw new BadRequestError('No file uploaded')
    }

    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError("Please upload image");
    }

    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new BadRequestError("Please upload image smaller than 1 MB");
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({
        message: "Success",
        image: `/uploads/${productImage.name}`
    })
}

//****************** upload product image on cloudinary ***************/
const uploadImage = async (req, res) => {
    const productImage = req.files.image;

    console.log(productImage);
    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError("Please upload image");
    }

    const maxSize = 1024 * 1024 * 2;
    if (productImage.size > maxSize) {
        throw new BadRequestError("Please upload image smaller than 2 MB");
    }

    const productImagePath = req.files.image.tempFilePath;
    const options = {
        use_filename: true,
        overwrite: true,
        folder: 'E-COMMERCE-API',
    }

    const result = await cloudinary.uploader.upload(productImagePath, options);

    //************* removing files from temp folder that express-file-upload middleware created *************/
    fs.unlinkSync(req.files.image.tempFilePath);

    //?result will contain the link to the photo and can be passed on to front-end
    return res.status(StatusCodes.OK).json({
        message: "Success",
        image: {
            src: result.secure_url
        }
    })
}



module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}