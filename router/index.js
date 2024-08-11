const express= require('express');
const router=express.Router();
const send=require('../controller/messageController');
router.post('/send',send.sendMessage)

module.exports=router;