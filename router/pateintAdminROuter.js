const express=require('express');
const router=express.Router();

const pateintAdminController=require('../controller/pateintAdminController');

// router.post('/patient/registor',pateintAdminController.newPatientRegistor);
// router.post('/admin/addnew',pateintAdminController.addAdmin)
// router.get('/doctors',pateintAdminController.getAllDoctors);
// router.get('/admin/me',auth.isAuthenticated,pateintAdminController.getUserDetails)
// router.get('/patient/me',auth.isPatientAuthenticated,pateintAdminController.getUserDetails)
// router.get('/admin/logout',auth.isAuthenticated,pateintAdminController.AdminLogout);
// router.get('/patient/logout',pateintAdminController.PatientLogout);
// router.get('/patient/auth',auth.isPatientAuthenticated,pateintAdminController.authCheckPatient);
// router.post('/admin/addNewDoctor',pateintAdminController.addNewDoctor)
// router.get('/department',pateintAdminController.getDepartment_doctor);
// router.post('/admin/addDepartment',pateintAdminController.addDeparment);


// // doctor can be added only by admin not by doctor else anyone can adddoctor 
// router.post('/doctor/addnew',auth.isAuthenticated,pateintAdminController.addNewDoctor);
// router.post('/doctor/slots',auth.isPatientAuthenticated,pateintAdminController.getSlots);

// :/Users/singh/OneDrive/Desktop/HealthMaster/HealthMaster/controller/pateintAdminContro

module.exports=router;