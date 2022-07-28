const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, "Please provide rating"],
        min: 1,
        max: 5,
    },

    title: {
        type: String,
        trim: true,
        required: [true, "Please provide review title"],
        maxLength: 25,
    },

    comment: {
        type: String,
        required: [true, "Please provide comment"]
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
    }
}, {
    timestamps: true
});

reviewSchema.statics.calculateAverageRatingAndNumOfReviews = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, numOfReviews: { $sum: 1 } } }
    ]);

    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            })
    } catch (error) {
        console.log(error);
    }
}

//*************** compound index to restrict user to leave a single review for a product, there can't be multiple reviews for same product from same user *************/
reviewSchema.index({
    product: 1,
    user: 1
}, {
    unique: true
});

reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRatingAndNumOfReviews(this.product);
    console.log("Post save hook called");
})
reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRatingAndNumOfReviews(this.product);
    console.log("Post remove hook called");
})



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;