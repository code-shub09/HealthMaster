const Message=require('../models/message');
const responseHandler=require('../utils/responseHandler')
const errorHandler=require('../utils/errorHandler')
async function handlerSend(req,res){

    const {firstName,lastName,email,phone,message}=req.body;
    if(!firstName || !lastName || ! email || !phone || !message ){
        console.log(firstName,lastName,email,phone,message)
        //   return res.status(400).json({
        //     success:false,
        //     message:'Please fill full form'
        //   })

        // centralised approach
        throw new errorHandler.customError('pls fill the form',400);
    }

   
    await Message.create({ firstName, lastName, email, phone, message });
    console.log(firstName,lastName,email,phone,message)
    res.status(200).json({
        success: true,
        message: 'Message sent successfully'
    });
    
}

const sendMessage_= responseHandler(handlerSend);
module.exports.sendMessage=sendMessage_;