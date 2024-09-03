const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');
const jwtX = require('../utils/jwtToken');
const Appointment = require('../models/appoinment');
const Doctor = require('../models/doctor');
const Slot = require('../models/slots');




async function createAppontment(req, res) {

    const { doctorId, sehedule } = req.body;
    const id = req.user.id;
    const Xdate = sehedule.date;
    console.log(doctorId);

    console.log('asa')

    let appointmentDate;
    if (typeof sehedule.date === 'string') {
        appointmentDate = new Date(sehedule.date);
        const localDate = new Date(appointmentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        console.log("dasds")
        console.log(localDate)
    } else if (sehedule.date instanceof Date) {
        appointmentDate = sehedule.date;
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid date format"
        });
    }

    if (!sehedule) {
        throw new errorHandler.customError('Pls fill the form', 400)
    }
    let appDate = {
        date: sehedule.date,
        time: sehedule.time
    }
    const newAppoint = await Appointment.create({ appointmentDate: appDate, doctorId: doctorId, patientId: id, status: "Pending" });

    try {
        // await Slot.create({doctorId,slots})
        const doc = await Slot.findOne({ doctorId: doctorId });
        doc.slots.push(sehedule);
        await doc.save()

        // console.log(doc);

    } catch (error) {
        console.log(error)

    }


    res.status(200).json({
        success: true
    })


}

async function history(req, res) {
    try {
        const id = '66ba2d400aa1902cee9de6ef';

        const UpcomingAppoint = await Appointment.find({ patientId: id, status: 'Pending' }).populate('doctorId').sort({ 'appointmentDate.date': -1 });



        const ExpireAppoint = await Appointment.find({ patientId: id, status: 'Completed' }).populate('doctorId').sort({ 'appointmentDate.date': -1 });

        res.status(200).json({
            success: true,
            data: {
                UpcomingAppoint,
                ExpireAppoint
            }
        });
    } catch (error) {
        console.log(error);
        throw new errorHandler.customError('Internal Server Error', 500);
    }




}
async function getAllAppointments(req, res) {
    console.log('getall')
    const All_appointments = await Appointment.find().populate('doctorId').populate('patientId');

    res.status(200).json({
        success: true,
        All_appointments,
    });
}

async function UpdateAppointment(req,res){
    const { status ,appointmentId}=req.body;
    // console.log(status,"sta")

    let appoint= await Appointment.findByIdAndUpdate(appointmentId,{status:status},{ new: true, runValidators: true });
    // appoint.status=status;
    // console.log(appoint);
    // console.log(appoint.status);
    res.status(200).json({success:true});
}
async function doctorAllAppointments(req,res){
    try { 
        const docId=req.doctor.id;
        const appoinments=await Appointment.findById(docId).populate('patientId');
        res.status(200).json({
            success:true,
            appoinments:appoinments
        })
    } catch (error) {
        console.log(error);
        
    }

}
module.exports.doctorAllAppointments=responseHandler(doctorAllAppointments);

module.exports.UpdateAppointment=responseHandler(UpdateAppointment);
module.exports.getAllAppointments = responseHandler(getAllAppointments)
module.exports.history = responseHandler(history);
module.exports.createAppontment = responseHandler(createAppontment);