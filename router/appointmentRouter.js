const express= require('express')
const router=express.Router();
const appointController=require('../controller/appointment');
const auth=require('../utils/auth');
router.post('/',auth.isPatientAuthenticated,appointController.createAppontment);
router.get('/history',appointController.history);
router.get('/getall',appointController.getAllAppointments);

router.put('/update',appointController.UpdateAppointment);
router.get('/dotor-appointment',auth.isDoctorAuthenticated,appointController.doctorAllAppointments);
module.exports=router;