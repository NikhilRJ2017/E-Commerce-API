class CustomErrorClass extends Error{
    constructor(message){
        super(message);
    }
}


module.exports = CustomErrorClass;