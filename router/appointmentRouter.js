const express= require('express')
const router=express.Router();
const appointController=require('../controller/appointment')
const auth=require('../utils/auth');
router.post('/',auth.isPatientAuthenticated,appointController.createAppontment);


module.exports=router;