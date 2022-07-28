const CustomErrorClass = require("./custom_errors");
const { StatusCodes } = require('http-status-codes');

class BadRequest extends CustomErrorClass {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}


module.exports = BadRequest;