const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions
} = require('../config/middlewares/authMiddleware');

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');

const { getSingleProductAllReviews } = require('../controllers/reviewController');



router.route('/')
    .post([authenticateUser, authorizePermissions('admin')], createProduct)
    .get(getAllProducts);


router.route('/uploadImage')
    .post([authenticateUser, authorizePermissions('admin')], uploadImage);


router.route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews')
    .get(getSingleProductAllReviews);

module.exports = router;