require('dotenv').config({ path: '../.env' })
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticateError } = require('../config/errors');
const { attachCookiesToResponse, createTokenUser } = require('../config/utils');

//***************** Register user ******************/
const register = async (req, res) => {
    const { name, email, password } = req.body;

    //? email existence is checked twice one on mongoose using unique index and here using findOne
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        throw new BadRequestError('Email already exist');
    }

    //? making 1st account as admin
    const isFirstAccount = await User.countDocuments({});
    const role = isFirstAccount === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });

    const tokenUser = createTokenUser(user)

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        user: tokenUser
    });
}

//****************** Login user ******************/
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if(!user){
        throw new UnauthenticateError("Invalid Credentials")
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        throw new UnauthenticateError("Invalid Credentials")
    }

    const tokenUser = createTokenUser(user)

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        user: tokenUser
    });
}

//*************** Logout user ******************/
const logout = async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000), //?cookie disappers in 10 seconds
    }

    res.cookie('token', 'logout', cookieOptions);
    res.status(StatusCodes.OK).json({
        message: "Success"
    })
}

module.exports = {
    register,
    login,
    logout
}