const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');
const jwtX = require('../utils/jwtToken');
const Appointment=require('../models/appoinment');


async function createAppontment(req,res){
    const { firstName, lastName, email, phone, gender, dob, nic, appointmentDate ,department, doctor, hasVisted, address} = req.body;
    if(!firstName || ! lastName || ! email || !phone || !gender || !dob ||  ! nic || !appointmentDate || !department || !doctor || !hasVisted || ! address){
        throw new errorHandler.customError('Pls fill the form',400)
    }

   
}

module.exports.createAppontment=responseHandler(createAppontment);