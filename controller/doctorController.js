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







async function getAllAppointments(req, res) {
  
    const All_appointments = await Appointment.find().populate('doctorId').populate('patientId');
    const NoDoc = await Doctor.find();



    res.status(200).json({
        success: true,
        NoDoc: NoDoc,
        All_appointments,
    });
}


async function doctorAllAppointments(req, res) {
 
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

        const docId = req.doctor._id;
      

        const appoinments = await Appointment.find({ doctorId: docId, 'appointmentDate.date': durationObject, status: statusFilter }).populate('patientId').sort({ 'appointmentDate.date': 1 });
       

        res.status(200).json({
            success: true,
            appoinments: appoinments,
            doctor: req.doctor

        })
    } catch (error) {
      

    }

}
async function doctorLogin(req, res) {

  
    const { email, password } = req.body;
   
    if (!email || !password) {
        throw new errorHandler.customError('pls enter login details correctly', 400);
    }



    const doct = await Doctor.findOne({ email: email });
 

    if (!doct) {
        throw new errorHandler.customError('please sign up , user donot exist', 400);

    } else {
        if (password != doct.password) {
            throw new errorHandler.customError('Password  donot match', 400);

        }
    }

    jwtX.doctor_generateToken(doct, res, `doctor loged successfuuly`, 200);
}
async function authDotor(req, res) {

    res.status(200).json({ success: true });


}


async function docTimngs(req, res) {

    const docId = req.doctor._id;
    const reqDoctor = await Doctor.findById(docId);
  
 


    res.status(200).json({
        timings: reqDoctor.timetable,
        success: true
    })
}

async function UpdateDocTimngs(req, res) {
    const docId = req.doctor._id;
  
    const { day, startTime, endTime, duration } = req.body;
    const reqDoctor = await Doctor.findById(docId);
    const UpdatedTimeTable = [];
    let isDayPresent = false;
    let i;
    for (i = 0; i < reqDoctor.timetable.length; i++) {
        if (reqDoctor.timetable[i].day == day) {


            UpdatedTimeTable.push({
                day,
                slots: {
                    startTime,
                    endTime,
                },
                duration
            });
            isDayPresent = true;
        } else {
            // UpdatedTimeTable[i]=reqDoctor.timetable[i];
            UpdatedTimeTable.push(reqDoctor.timetable[i]);
        }
    }
    if (!isDayPresent) {
        i++;
        UpdatedTimeTable.push({
            day,
            slots: {
                startTime,
                endTime,
            },
            duration
        });

    }

 
    const dayOrder = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    ];

    // Sort the timetable according to the predefined order
    UpdatedTimeTable.sort((a, b) =>
        dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    );

    // Update the timetable in the doctor document
    reqDoctor.timetable = UpdatedTimeTable;
    await reqDoctor.save();


    res.status(200).json({
        timings: reqDoctor.timetable,
        success: true
    })


}



async function todayAndLastAppointment(req, res) {
  
    try {
        const docId = req.doctor._id;
        const today = new Date();

        // Days of the week as an array
        const week = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ];

        // Get today's numeric day index and name
        const dayNum = today.getDay(); // 0=Sunday, 6=Saturda
        const dayName = week[dayNum]; // Name of today's day

        // Fetch the doctor with appointments populated
        const doctor = await Doctor.findById(docId);
      

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Extract the doctor's working days
        const workingDays = doctor.timetable.map((item) => item.day);

        // Helper function: Get the previous working day from the timetable
        const getPreviousWorkingDay = (days) => {
            const todayIndex = new Date().getDay(); // Numeric value of today
            const dayIndices = days.map((day) => week.indexOf(day)); // Convert to indices

            // Loop backwards from today to find the previous working day
            for (let i = todayIndex - 1; i >= -7; i--) {
                const adjustedIndex = (i + 7) % 7; // Handle negative index wraparound
                if (dayIndices.includes(adjustedIndex)) {
                    return week[adjustedIndex]; // Return the name of the previous working day
                }
            }
            return null;
        };

        const lastDay = getPreviousWorkingDay(workingDays);
    




        // Helper function: Get the most recent occurrence of the previous working day
        const getLastOccurrenceOfDay = (targetDay) => {
            const targetDayIndex = week.indexOf(targetDay);
            let date = new Date();

            // Move back to the most recent occurrence of the target day
            while (date.getDay() !== targetDayIndex) {
                date.setDate(date.getDate() - 1);
            }
            return date;
        };


        let lastDayAppointments = [];


        if (lastDay != null) {
            const lastDayDate = getLastOccurrenceOfDay(lastDay);
           
            lastDayAppointments = await Appointment.find({
                doctorId: docId,
                'appointmentDate.date': {
                    $gte: lastDayDate.setHours(0, 0, 0, 0),
                    $lte: lastDayDate.setHours(23, 59, 59, 999)
                }
            }).populate('patientId');
        }



        // Filter today's appointments
        // const docAppointX= await appointment.find({doctorId:docId});


        const todayAppointments = await Appointment.find({
            doctorId: docId,
            'appointmentDate.date': {
                $gte: today.setHours(0, 0, 0, 0),
                $lte: today.setHours(23, 59, 59, 999)
            }, status: { $eq: 'Pending' }
        }).populate('patientId');

        // Filter appointments for the most recent occurrence of the previous working day






        // Send response with both today's and last working day's appointments
        res.status(200).json({
            success: true,
            data: {
                todayAppointments,
                lastDayAppointments,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
}

async function DoctorLogout(req, res) {

    res.status(200).cookie("DoctorToken", '', { maxAge: 0, httpOnly: true }).json({
        success: true,
        message: 'logout success'
    })



}
async function DocAvtarUpload(req, res) {
  
    try {
        // req.file contains information about the uploaded file
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "doctor_avtar" });
        const avtar_url = result.secure_url;
      
        const docX = req.doctor._id;
        const updatedDoc = await Doctor.findByIdAndUpdate(docX, { doctorAvtar: avtar_url }, { new: true });
       

        fs.unlink(req.file.path, (err) => {
            if (err) {
                // console.error("Error deleting local file:", err.message);
            } else {
                // console.log("Local file deleted");
            }
        })


        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function docDetails(req, res) {
    try {
        const docDetail = await Doctor.findById(req.doctor._id);
        res.status(200).json({
            success: true,
            docDetail: docDetail
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });


    }
}

async function delTiming(req, res) {
    try {
        const { day } = req.body;
        if (!day) {
            return res.status(400).json({ success: false, message: "Day is required" });
        }
        
        const doc_id = req.doctor._id;
      
        const newData = await Doctor.findByIdAndUpdate(doc_id, { $pull: { timetable: { day: day } } }, { new: true });
      
        res.status(200).json({
            success: true,
            timings: newData.timetable
        })

    } catch (error) {
        // console.log(error);


    }


}
async function UpdateAppointment(req, res) {
    const { idX, statusX } = req.body;
  

    let appoint = await Appointment.findByIdAndUpdate(idX, { status: statusX }, { new: true, runValidators: true });

    res.status(200).json({ success: true });
}

module.exports.delTiming = responseHandler(delTiming);
module.exports.docDetails = responseHandler(docDetails);
module.exports.DocAvtarUpload = responseHandler(DocAvtarUpload);

module.exports.DoctorLogout = responseHandler(DoctorLogout);

module.exports.todayAndLastAppointment = responseHandler(todayAndLastAppointment);

module.exports.UpdateDocTimngs = responseHandler(UpdateDocTimngs);

module.exports.docTimngs = responseHandler(docTimngs);
module.exports.authDotor = responseHandler(authDotor);

module.exports.doctorLogin = responseHandler(doctorLogin);
module.exports.doctorAllAppointments = responseHandler(doctorAllAppointments);

module.exports.UpdateAppointment = responseHandler(UpdateAppointment);
module.exports.getAllAppointments = responseHandler(getAllAppointments);

