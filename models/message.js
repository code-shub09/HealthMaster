const mongoose=require('mongoose');

const validator= require('validator');
const { default: isEmail } = require('validator/lib/isEmail');

const messageSchema=new mongoose.Schema({
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
    message:{
        type:String,
        required:true,
        minLength:[10,"First name must contain at least 10 letters"]
    }

})

const Message=mongoose.model('Message',messageSchema)
module.exports=Message;
