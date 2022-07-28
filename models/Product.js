const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxLength: [100, "Name cannot be more than 100 characters"]
    },

    price: {
        type: Number,
        required: [true, "Please provide product price"],
        default: 0,
    },

    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxLength: [1000, "Name cannot be more than 100 characters"],
    },

    image: {
        type: String,
        default: '/uploads/default_product_image.jpeg'
    },

    category: {
        type: String,
        required: [true, "Please provide product category"],
    },

    company: {
        type: String,
        required: [true, "Please provide product company"],
    },

    colors: {
        type: [String],
        required: true,
        default: ['#000000']
    },

    featured: {
        type: Boolean,
        default: false,
    },

    freeShipping: {
        type: Boolean,
        default: false,
    },

    inventory: {
        type: Number,
        required: true,
        default: 15
    },

    averageRating: {
        type: Number,
        default: 0,
    },

    numOfReviews: {
        type: Number,
        default: 0,
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//? localField and foreignField is used to establish connections
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

productSchema.pre('remove', async function () {
    await this.model('Review').deleteMany({ product: this._id });
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;