// Error is inbulit class 
class errorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

const errorMiddelware=(err,req,res,next)=>{
    err.message=err.message ||'inter server error';
    err.statusCode=err.statusCode || 500;
    if (err.code ===11000) {
        const message =`Duplicate ${Object.keys(err.KeyVlaue)}Entered`;
        err =new errorHandler(message,400);
    }
    
    if(err.name ==='JsonWebTokenError'){
        const message='Json web token error'
        err=new errorHandler(message,400)
    }

    if(err.name ==='TokenExpiredError'){
        const message='Json web token is expired '
        err=new errorHandler(message,400)
    }

    // error  if u enters wrong data fields
    if(err.name ==='CasteError'){
        const message=`Invalid ${err.path}`
        err=new errorHandler(message,400)
    }

    return res.status(err.status).json({
        success:false,
        message:'message send successfully'
    });
}

module.exports.customError=errorHandler;
