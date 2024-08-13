
const mongoose=require('mongoose');

const validator= require('validator');

const apponmentSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain at least three letters"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain at least three letters"]

    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"First name must contain exact 10 digits"],
        maxLength:[10,"First name must contain exact 10 digits "]

    }
    ,
    nic:{
        type:String,
        required:true,
        minLength:[3,"First name must contain at least 10 letters"],
        maxLength:[3,"js"]
    },
    dob:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female']
    },
    appointmentDate:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    doctor:{
        firstName:{
            type:String,
            required:true
        },
        lastNameName:{
            type:String,
            required:true
        }
    },
    hasVisted:{
        type:Boolean,
        required:true
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true

    }
    ,address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    },




   

})

const appointment=mongoose.model('Appointment',apponmentSchema);
module.exports=appointment;