const CustomErrorClass = require("./custom_errors");
const { StatusCodes } = require('http-status-codes');

class Unauthorize extends CustomErrorClass{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}


module.exports = Unauthorize;