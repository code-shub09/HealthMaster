const errorHandler=require('./errorHandler');
const jwt =require('jsonwebtoken');
const User=require('../models/User')
const responseHnadler=require('./responseHandler');


async function isAuthenticated(re,res,next){
    const toekn=req.cookies.adminToken;
    if(!toekn){
        throw new errorHandler.customError('admin is not authenticated',400);
    }
    
    // this return id of user which is stored in decoded
    const decoded=jwt.verify(toekn,process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decoded.id);
    if(req.user.role !== 'Admin'){
        throw new errorHandler.customError('not authorised for this reqources !',403);
    }

    next()

}

async function isPatientAuthenticated(re,res,next){
    const toekn=req.cookies.patientToken;
    if(!toekn){
        throw new errorHandler.customError('pateint is not authenticated',400);
    }
    
    // this return id of user which is stored in decoded
    const decoded=jwt.verify(toekn,process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decoded.id);
    if(req.user.role !== 'Patient'){
        throw new errorHandler.customError('not authorised for this reqources !',403);
    }

    next()

}

module.exports.isPatientAuthenticated=responseHnadler(isPatientAuthenticated);

module.exports.isAuthenticated=responseHnadler(isAuthenticated);