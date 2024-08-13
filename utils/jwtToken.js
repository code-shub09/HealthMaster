
const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');

function generateToken(user, res,message,statusCode) {
    const token = user.genrateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken"

    res.status(statusCode).cookie(cookieName, token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true
        
    })
    .json({sucess:true,message,
        token,
        user 
    })
}

module.exports.GenerateToken=generateToken;