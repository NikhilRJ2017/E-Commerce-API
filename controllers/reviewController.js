const Product = require('../models/Product');
const Review = require('../models/Review');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../config/errors');
const { checkPermissions } = require('../config/utils');



//************* Create review ****************/
const createReview = async (req, res) => {

    //?checking if product exists before adding review to it
    const { product: productId } = req.body;
    const isProductValid = await Product.findById(productId);

    if (!isProductValid) {
        throw new NotFoundError(`No product with id ${productId}`);
    }

    //?check if user already submitted the review, even though we have our index for product and user in Review model which will an throw an error for dupliacte values
    const alreadyReviewed = await Review.findOne({
        product: productId,
        user: req.user.userId
    });

    if (alreadyReviewed) {
        throw new BadRequestError('Already sumbitted review for this product')
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body)
    res.status(StatusCodes.OK).json({
        message: "Success",
        review: review
    })
}

//************* Get all reviews **************/
const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
        .populate({ path: 'product', select: 'name company price' })
        .populate({ path: 'user', select: 'name' })

    res.status(StatusCodes.OK).json({
        message: "Success",
        count: reviews.length,
        reviews: reviews
    });
}

//************* Get single review **************/
const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findById(reviewId)
        .populate({ path: 'product', select: 'name company price' })
        .populate({ path: 'user', select: 'name' });
    
    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }
    res.status(StatusCodes.OK).json({
        message: "Success",
        review: review
    });
}

//************* Update review ***************/
const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }
    checkPermissions(req.user, review.user);

    const { rating, title, comment } = req.body;
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({
        message: "Success",
        review: review
    });

}

//************* Delete review **************/
const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }

    //?check if the user who wants to delete is same as the one who created it
    checkPermissions(req.user, review.user);
    await review.remove();

    res.status(StatusCodes.OK).json({
        message: "Success"
    });

}

//**************** Get single product all reviews (alternative to virtuals) ***************/
const getSingleProductAllReviews = async (req, res)=>{
    //? we are creating a new route in products routes to accomplish our goal
    //? we are passing product id as a param
    //? route will be like -> /api/v1/products/:id/reviews

    const {id: productId} = req.params;
    const reviews = await Review.find({product : productId});

    res.status(StatusCodes.OK).json({
        message: "Success",
        count: reviews.length,
        reviews: reviews
    });
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductAllReviews
}