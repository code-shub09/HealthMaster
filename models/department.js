const mongoose=require('mongoose');

const DepartmentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    doctorsList:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
           
        }
    ]

})



const Deparment=mongoose.model('Deparment',DepartmentSchema)
module.exports=Deparment;
