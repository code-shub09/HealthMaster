const express=require('express');
const auth=require('../utils/auth');

const userController= require("../controller/userController");
const upload = require('../utils/multerSetup');

const router=express.Router();

router.post('/patient/login',userController.login);

router.post('/patient/register',userController.newPatientRegistor);
router.post('/admin/addnew',userController.addAdmin)
router.get('/doctors',userController.getAllDoctors);
router.get('/admin/me',auth.isAuthenticated,userController.getUserDetails)
router.get('/patient/me',auth.isPatientAuthenticated,userController.getUserDetails)
router.get('/admin/logout',auth.isAuthenticated,userController.AdminLogout);
router.get('/patient/logout',userController.PatientLogout);
router.get('/patient/auth',auth.isPatientAuthenticated,userController.authCheckPatient);
router.post('/admin/addNewDoctor',upload.none(),userController.addNewDoctor)
router.get('/department',auth.isPatientAuthenticated,userController.getDepartment_doctor);
router.post('/admin/addDepartment',userController.addDeparment);
router.get('/logout')

// doctor can be added only by admin not by doctor else anyone can adddoctor 
router.post('/doctor/addnew',auth.isAuthenticated,userController.addNewDoctor);
router.post('/doctor/slots',auth.isPatientAuthenticated,userController.getSlots);


module.exports=router;