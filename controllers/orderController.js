const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../config/utils");
const { BadRequestError, NotFoundError } = require("../config/errors");

//*************** Get all orders **************/
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate({ path: 'user', select: 'name' })
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: orders.length,
        orders: orders
    })
};

//************** Get single order **************/
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError(`No order with id ${orderId}`);
    }

    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({
        message: "Success",
        order: order
    })
};

//************** Get current user order *****************/
const getCurrentUserOrder = async (req, res) => {
    const { userId } = req.user;
    const orders = await Order.find({ user: userId });
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: orders.length,
        orders: orders
    })
};

//****************** Fake stripe api ********************/
const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue'
    return { client_secret, amount }
}
//************** Create order *****************/

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError(`No cart items provided`);
    }

    if (!tax || !shippingFee) {
        throw new BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = [];
    let subtotal = 0;

    //? getting items from cart
    for (const item of cartItems) {
        const dbProduct = await Product.findById(item.product);
        if (!dbProduct) {
            throw new NotFoundError(`No product with id ${item.product}`);
        }

        const { name, price, image, _id } = dbProduct;

        const singleOrderItem = {
            quantity: item.quantity,
            name,
            price,
            image,
            product: _id
        }

        //?adding item to order (array)
        orderItems = [...orderItems, singleOrderItem];
        subtotal += item.quantity * price;

    }

    //?total price
    const total = tax + shippingFee + subtotal;

    //?get client secret for setting stripe payment
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'inr'
    });

    /**
 * *Order Schema->{
 *      *Cart items
 *      *{
 *          !name
 *          !image
 *          !price
 *          !amount
 *      *}
 *
 *      !tax
 *      !shipping fee
 *      !subTotal
 *      !total
 *      !status - default (pending)
 *      !user
 *      !clientSecret
 *      !paymentIntentId
 *
 * *}
 */
    const order = await Order.create({
        cartItems: orderItems,
        total,
        subTotal: subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.OK).json({
        message: "Success",
        clientSecret: order.clientSecret,
        order: order
    })
};

//************** Update order *****************/
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order.findById(orderId).populate({ path: 'user', select: 'name' });
    if (!order) {
        throw new NotFoundError(`No order with id ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({
        message: "Success",
        order: order
    });
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    createOrder,
    updateOrder,
};
