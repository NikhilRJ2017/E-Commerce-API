const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticateError, NotFoundError } = require('../config/errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../config/utils');

//**************** Get all users *****************/
const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({
        message: "Success",
        users: users
    });
}

//*************** Get a single user ****************/
const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
        throw new NotFoundError(`No user with id ${userId}`)
    }

    checkPermissions(req.user, user._id);
    
    res.status(StatusCodes.OK).json({
        message: "Success",
        user: user
    });
}

//*************** Get current user ***************/
const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "Success",
        user: req.user
    })
}

//*************** Update user *****************/
const updateUser = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new BadRequestError("Please provide all values");
    }

    //? using findOneAndUpdate instead save() because it will trigger the save hook and re-hashes the current hashed password, which can create chaos
    const { userId } = req.user;
    const user = await User.findOneAndUpdate({ _id: userId }, { email, name }, { new: true, runValidators: true });

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.OK).json({
        message: "Success",
        user: tokenUser
    });

}

//*************** Update user password ****************/
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError("Please provide old and new password");
    }

    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });

    const isOldPwdMatch = await user.comparePassword(oldPassword);
    if (!isOldPwdMatch) {
        throw new BadRequestError("Please provide valid old password");
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({
        message: "Success"
    })
}


module.exports = {
    getAllUsers,
    getSingleUser,
    getCurrentUser,
    updateUser,
    updateUserPassword
}