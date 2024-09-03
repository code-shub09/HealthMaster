// Error is inbulit class 
class errorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}



module.exports.customError=errorHandler;
