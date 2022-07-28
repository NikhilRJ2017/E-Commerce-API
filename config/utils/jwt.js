require('dotenv').config({ path: '../../.env' });
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
    const secret = process.env.JWT_SECRET_KEY;
    const options = {
        algorithm: process.env.JWT_ALGO,
        expiresIn: process.env.JWT_LIFETIME
    }
    const token = jwt.sign(payload, secret, options);

    return token;
}

const isTokenValid = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_DEV === 'production',
        signed: true
    }
    res.cookie('token', token, cookieOptions);
   
}

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}