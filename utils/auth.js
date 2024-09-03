const errorHandler=require('./errorHandler');
const jwt =require('jsonwebtoken');
const User=require('../models/User')
const responseHnadler=require('./responseHandler');
const Doctor = require('../models/doctor');


async function isAuthenticated(req,res,next){
    console.log(req.cookies)
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

async function isPatientAuthenticated(req,res,next){
    const toekn=req.cookies.patientToken;
    console.log(req.cookies);
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

async function isDoctorAuthenticated(req,res,next){
    const toekn=req.cookies.DoctorToken;
    console.log(req.cookies);
    if(!toekn){
        throw new errorHandler.customError('Doctor is not authenticated',400);
    }
    
    // this return id of user which is stored in decoded
    const decoded=jwt.verify(toekn,process.env.JWT_SECRET_KEY);
    req.doctor =await Doctor.findById(decoded.id);
    if(req.doctor){
        throw new errorHandler.customError('not authorised for this reqources !',403);
    }

    next()

}
module.exports.isDoctorAuthenticated=responseHnadler(isDoctorAuthenticated)
module.exports.isPatientAuthenticated=responseHnadler(isPatientAuthenticated);

module.exports.isAuthenticated=responseHnadler(isAuthenticated);