
const mongoose=require('mongoose');

const validator= require('validator');

const apponmentSchema= new mongoose.Schema({
    
    appointmentDate:{
         date: {
            type: Date,
            required: true,
        },
        time:{
            type:String,
            required:true
        }
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        ref:"Doctor",
        required:true
       
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true

    }
  ,
    status:{
        type:String,
        enum:["Pending","Completed","Reject",'Unattended'],
        default:"Pending"
    },




   

})
apponmentSchema.index({ "appointmentDate.date": 1, "appointmentDate.time": 1 });

const appointment=mongoose.model('Appointment',apponmentSchema);
module.exports=appointment;