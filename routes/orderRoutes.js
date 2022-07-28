const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    createOrder,
    updateOrder,
} = require("../controllers/orderController");

const {
    authenticateUser,
    authorizePermissions,
} = require("../config/middlewares/authMiddleware");

router
    .route("/")
    .post(authenticateUser, createOrder)
    .get(authenticateUser, authorizePermissions("admin"), getAllOrders);

router.route("/showMyAllOrders").get(authenticateUser, getCurrentUserOrder);

router
    .route("/:id")
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);

module.exports = router;
