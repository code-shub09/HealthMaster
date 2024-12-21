const express = require('express')
const router = express.Router();
const appointController = require('../controller/appointment');
const auth = require('../utils/auth');
console.log('appointment router');
const multer = require('multer');
const path = require('path');
const upload=require('../utils/multerSetup');

router.post('/', auth.isPatientAuthenticated, appointController.createAppontment);
router.get('/history', auth.isPatientAuthenticated,appointController.history);
router.get('/getall', appointController.getAllAppointments);
router.post('/doctor-appointment',auth.isAuthenticated,appointController.adminAllAppointments);

module.exports = router;
