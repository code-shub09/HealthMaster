const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');
const jwtX = require('../utils/jwtToken');
const Appointment = require('../models/appoinment');
const Doctor = require('../models/doctor');
const Slot = require('../models/slots');
const appointment = require('../models/appoinment');

const cloudinary = require('../utils/cloudinary');
const fs = require('fs')




async function createAppontment(req, res) {

    const { doctorId, sehedule } = req.body;
    const id = req.user.id;
    const Xdate = sehedule.date;
  

 
    let appointmentDate;
    if (typeof sehedule.date === 'string') {
        appointmentDate = new Date(sehedule.date);
        const localDate = new Date(appointmentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      
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

      

    } catch (error) {
     

    }


    res.status(200).json({
        success: true
    })


}


async function history(req, res) {
    try {
        const id = req.user;
        
        const now = new Date();
      
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowInIST = new Date(now.getTime() + istOffset);
    

        // Start of the day in IST
        const startOfDayIST = new Date(nowInIST.getFullYear(), nowInIST.getMonth(), nowInIST.getDate(), 0, 0, 0);
     
        
        const startOfDayUTC = new Date(startOfDayIST.getTime() - istOffset);
        const durationObject = {
            $gte: startOfDayUTC
        }
        const UpcomingAppoint = await Appointment.find({
            patientId: id, // Add patient-specific filtering
            status: 'Pending',
            'appointmentDate.date': durationObject

        }).populate('doctorId').sort({ 'appointmentDate.date': 1 });

       

        const ExpireAppoint = await Appointment.find({ patientId: id, status: {$ne:'Pending'} }).populate('doctorId').sort({ 'appointmentDate.date': 1 });

        res.status(200).json({
            success: true,
            data: {
                UpcomingAppoint,
                ExpireAppoint
            }
        });
    } catch (error) {
        
        throw new errorHandler.customError('Internal Server Error', 500);
    }




}
async function getAllAppointments(req, res) {
    
    const All_appointments = await Appointment.find().populate('doctorId').populate('patientId');
    const NoDoc = await Doctor.find();



    res.status(200).json({
        success: true,
        NoDoc: NoDoc,
        All_appointments,
    });
}

async function adminAllAppointments(req, res) {
    const NoDoc = await Doctor.find();
    const All_appointments = await Appointment.find()
  
    try {
        const { AppointmentDuration, ButtonAppoinmet } = req.body;

        let statusFilter;
        if (ButtonAppoinmet === 'Upcoming') {
            statusFilter = 'Pending'; // For upcoming, we filter by "Pending" status
        } else {
            statusFilter = { $ne: 'Pending' }; // For non-upcoming, we filter for statuses that are NOT "Pending"
        }
      

        let toDate;
        const today = new Date();
        let durationObject;

        today.setUTCHours(0, 0, 0, 0);
        let fromDate = today;
        const Xstatus = 'Pending';
        if (AppointmentDuration == 'Today' && ButtonAppoinmet == 'Upcoming') {

            
            const now = new Date();
           
            const istOffset = 5.5 * 60 * 60 * 1000;
            const nowInIST = new Date(now.getTime() + istOffset);
          

            const startOfDayIST = new Date(nowInIST.getFullYear(), nowInIST.getMonth(), nowInIST.getDate(), 0, 0, 0);
          
            const endOfDayIST = new Date(nowInIST.getFullYear(), nowInIST.getMonth(), nowInIST.getDate(), 23, 59, 59);

            const startOfDayUTC = new Date(startOfDayIST.getTime() - istOffset);
      
            const endOfDayUTC = new Date(endOfDayIST.getTime() - istOffset);

            durationObject = {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC,
            };

        }
        if (AppointmentDuration == 'Week' && ButtonAppoinmet == 'Upcoming') {
            const endOfWeek = new Date(today);
            endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7); // Add 7 days
            endOfWeek.setUTCHours(23, 59, 59, 999); // Set time to the end of the day
            toDate = endOfWeek;
            durationObject = {
                $gte: fromDate,
                $lte: toDate


            }


        }


        if (AppointmentDuration === 'Month' && ButtonAppoinmet == 'Upcoming') {
            const endOfMonth = new Date(today);
            endOfMonth.setUTCDate(endOfMonth.getUTCDate() + 30); // Add 30 days
            endOfMonth.setUTCHours(23, 59, 59, 999); // Set to end of the day
            toDate = endOfMonth;

            durationObject = {
                $gte: fromDate,
                $lte: toDate // Include end of the month
            };
        }
        if (AppointmentDuration === 'Year' && ButtonAppoinmet == 'Upcoming') {
            const endOfYear = new Date(today);
            endOfYear.setUTCDate(endOfYear.getUTCDate() + 365); // Add 30 days
            endOfYear.setUTCHours(23, 59, 59, 999); // Set to end of the day
            toDate = endOfYear;

            durationObject = {
                $gte: fromDate,
                $lte: toDate // Include end of the month
            };
        }
        if (AppointmentDuration === 'All-Time' && ButtonAppoinmet == 'Upcoming') {
            const endOfYear = new Date(today);
            endOfYear.setUTCDate(endOfYear.getUTCDate() + 365); // Add 30 days
            endOfYear.setUTCHours(23, 59, 59, 999); // Set to end of the day
            toDate = endOfYear;

            durationObject = {
                $gte: fromDate,

            };
        }
       

        if (AppointmentDuration == 'Today' && ButtonAppoinmet != 'Upcoming') {

            // const endOfDay = new Date(today);
            // endOfDay.setUTCHours(23, 59, 59, 999);
            toDate = new Date();


            // toDate = endOfDay;
            durationObject = {
                $gte: fromDate,
                $lte: toDate


            }

        }
        if (AppointmentDuration == 'Week' && ButtonAppoinmet != 'Upcoming') {
            let toDate;
            const today = new Date();
            const dayOfWeek = today.getUTCDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
            const diffToMonday = (dayOfWeek + 6) % 7; // Calculate how far Monday is from today
            let fromDate = new Date(today);
            fromDate.setUTCDate(today.getUTCDate() - diffToMonday); // Set the date to the previous Monday
            fromDate.setUTCHours(0, 0, 0, 0);
            toDate = new Date(); // Now

            // Define the duration object to filter appointments from the start of the week to the current time (for history)
            durationObject = {
                $gte: fromDate,  // Start of the week (previous Monday)
                $lte: toDate     // Current time
            };
          

        }


        if (AppointmentDuration === 'Month' && ButtonAppoinmet != 'Upcoming') {

            toDate = new Date();
            let fromDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);

            durationObject = {
                $gte: fromDate,
                $lte: toDate
            };
        
        }
        if (AppointmentDuration === 'Year' && ButtonAppoinmet != 'Upcoming') {

            toDate = new Date();
            let fromDate = new Date(today.getUTCFullYear(), 0, 1);

            durationObject = {
                $gte: fromDate,
                $lte: toDate
            };
        }
        if (AppointmentDuration === 'All-Time' && ButtonAppoinmet != 'Upcoming') {


            toDate = new Date();

            durationObject = {
                $lte: toDate,

            };
        }

      

        const appoinments = await Appointment.find({ 'appointmentDate.date': durationObject, status: statusFilter }).populate('patientId').populate('doctorId').sort({ 'appointmentDate.date': 1 });
     

        res.status(200).json({
            success: true,
            appoinments: appoinments,
            NoDoc:NoDoc.length,
            NumAppoint:All_appointments
          

        })
    } catch (error) {
        

    }

}

module.exports.adminAllAppointments=responseHandler(adminAllAppointments);
module.exports.getAllAppointments = responseHandler(getAllAppointments)
module.exports.history = responseHandler(history);
module.exports.createAppontment = responseHandler(createAppontment);