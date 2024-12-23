const mongoose = require('mongoose');
const { isJWT } = require('validator');
const jwt=require('jsonwebtoken');

// Define the Doctor schema
const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        minLength:[8,'password must contain at least 8 characters'],
        required:true,
        
    },
    gender:{
        type:String,
        enum:['Male','Female']

    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    dob:{
        type:Date,
        required:true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number, // in years
        required: true
    },
    qualifications: {
        type: [String], // Array of qualifications
        required: true
    },
    doctorAvtar:{
        type:String
    },
    timetable: [{
        day: {
            type: String,
            enum: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
        },
        slots: {
            startTime: {
                type: String, // Example: "09:00 AM"
                
            },
            endTime: {
                type: String, // Example: "01:00 PM"
                
            }
        },
        duration:{
            type:String,
            
        }
    }]

 
});

doctorSchema.methods.doctorJsonWebToken=function(){
     return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY_DOCTOR,{expiresIn:'24h'})
}
// Create the Doctor model from the schema
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
