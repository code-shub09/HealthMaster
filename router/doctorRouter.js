const express=require('express');
const router=express.Router();
const auth=require('../utils/auth');

const docController= require("../controller/doctorController");

const multer = require('multer');
const path = require('path');
const upload=require('../utils/multerSetup');
router.post('/dotor-appointment', auth.isDoctorAuthenticated, docController.doctorAllAppointments);
router.get('/doctor-auth', auth.isDoctorAuthenticated, docController.authDotor);
router.get('/dotor-appointment-last-today', auth.isDoctorAuthenticated, docController.todayAndLastAppointment);
router.post('/doctorlogin', docController.doctorLogin);
router.get('/timings', auth.isDoctorAuthenticated, docController.docTimngs);
router.post('/timings/update', auth.isDoctorAuthenticated, docController.UpdateDocTimngs);
router.post('/doctor-appoint-status-updated', docController.UpdateAppointment)
router.get('/logged-in', auth.isDoctorAuthenticated, (req, res) => {

    return res.status(200).json({ message: 'Doctor is authenticated',success:true });

});
router.get('/details',auth.isDoctorAuthenticated,docController.docDetails)

router.get('/logout', auth.isDoctorAuthenticated, docController.DoctorLogout);


router.post('/profile/upload',auth.isDoctorAuthenticated, upload.single('profilePicture'), docController.DocAvtarUpload);
router.post('/timings/delete',auth.isDoctorAuthenticated,docController.delTiming);
module.exports = router;
