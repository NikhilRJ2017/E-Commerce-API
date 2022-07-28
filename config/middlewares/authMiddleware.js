const { UnauthenticateError, UnauthorizeError } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new UnauthenticateError('Authentication invalid');
    }

    try {
        const { name, userId, role } = isTokenValid({ token });
        //? attach user info to req so that all other upcoming routes can access it
        req.user = {
            name: name,
            userId: userId,
            role: role
        }
        next();
    } catch (error) {
        throw new UnauthenticateError('Authentication invalid');
    }

}

const authorizePermissions = (...roles)=>{

    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new UnauthorizeError('Unauthroized to access this route')
        }
        next();
    };
    
}

module.exports = {
    authenticateUser,
    authorizePermissions
}