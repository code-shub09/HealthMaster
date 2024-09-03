const express= require('express');
const router=express.Router();
const auth=require('../utils/auth');
const messageController=require('../controller/messageController');
router.post('/send',messageController.sendMessage)
router.get('/getall',messageController.getAllMeaasges)


module.exports=router;