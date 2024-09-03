const mongoose = require('mongoose');


const slotsSchema= new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    slots:[
        { date: {
            type: Date,
            
        },
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
            ], // Limits to valid days of the week
        },
        time: {
            type: String, 
            
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            
        }
        }
    ]
})


const Slot=mongoose.model('Slot',slotsSchema);
module.exports=Slot;