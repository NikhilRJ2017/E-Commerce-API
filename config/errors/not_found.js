const CustomErrorClass = require("./custom_errors");
const { StatusCodes } = require('http-status-codes');

class NotFound extends CustomErrorClass {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}


module.exports = NotFound;