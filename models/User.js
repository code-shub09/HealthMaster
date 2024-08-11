const mongoose=require('mongoose');

const validator= require('validator');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema=new mongoose.Schema({
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
        minLength:[13,"First name must contain at least 10 letters"],
        maxLength:[13,"js"]
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
    password:{
        type:String,
        minLength:[8,'password must contain at least 8 characters'],
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        enum:['Admin','Patient','Doctor'],
    },
    doctarDepartment:{
        type:String,
    },
    dovAvtar:{
        public_id:String,
        url:String,

    }





})

const Message=mongoose.model('User',messageSchema)
module.exports=Message;
