const express = require('express');
const { authenticateUser } = require('../config/middlewares/authMiddleware');
const router = express.Router();

const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

router.route('/')
    .get(getAllReviews)
    .post(authenticateUser, createReview);

router.route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;