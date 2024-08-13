const express=require('express');
const auth=require('../utils/auth');
const messageController=require('../controller/messageController')
const userController=require('../controller/userController');

const router=express.Router();

router.post('/patient/login',userController.login);

router.post('/patient/registor',userController.newPatientRegistor);
router.post('/admin/addnew',auth.isAuthenticated,userController.addAdmin)
router.get('/doctors',userController.getAllDoctors);
router.get('/admin/me',auth.isAuthenticated,userController.getUserDetails)
router.get('/patient/me',auth.isPatientAuthenticated,userController.getUserDetails)
router.get('admin/logout',userController.AdminLogout);
router.get('/patient/logout',userController.PatientLogout);


// doctor can be added only by admin not by doctor else anyone can adddoctor 
router.post('/doctor/addnew',auth.isAuthenticated,userController.addNewDoctor);


router.get('/messages',auth.isAuthenticated,messageController.getAllMeaasges)
module.exports=router;