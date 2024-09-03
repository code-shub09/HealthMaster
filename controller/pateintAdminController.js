const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');
const jwtX = require('../utils/jwtToken');
const cloud = require('cloudinary')
const Doctor = require('../models/doctor');
const Deparment = require('../models/department')
const crypto = require('crypto')
const Slot = require('../models/slots');
const { default: Appointment } = require('../../HealthMaster-Frontend/frontend/src/compoents/Appointment');
async function PatientRegistor(req, res) {

    const { firstName, lastName, email, phone, gender, dob, password, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password || !role) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }



    const user = await User.findOne({ email: email });
    if (user) {
        throw new errorHandler.customError('user already exist', 400);
    }
    const newUser = await User.create({ firstName, lastName, email, phone, dob, gender, password, role });
    jwtX.GenerateToken(newUser, res, 'user registered successfully', 200)
}
async function login(req, res) {
    const { email, password } = req.body;
    console.log('emai;',email,password)
    if (!email || !password) {
        throw new errorHandler.customError('pls enter login details correctly', 400);
    }



    const user = await User.findOne({ email: email });
    console.log('user,',user);

    if (!user) {
        throw new errorHandler.customError('please sign up , user donot exist', 400);

    } else {
        if (password != user.password) {
            throw new errorHandler.customError('Password  donot match', 400);

        }
    }

    jwtX.GenerateToken(user, res, `${user.role} loged successfuuly`, 200)




}

async function addAdmin(req, res) {
    const { firstName, lastName, email, phone, gender, dob, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }
    const isRegisterd = await User.findOne({ email });

    if (isRegisterd) {
        throw new errorHandler.customError(`${isRegisterd.role} already registed`, 400);

    }
    const admin = await User.create({ firstName, lastName, email, phone, dob, gender, password, role: 'Admin' })

    res.status(200).json({
        success: true,
        message: "New Admin Registered"
    })

}

async function getAllDoctors(req, res) {

    const doctors = await Doctor.find();
    console.log('docrt')
    console.log(doctors)
    res.status(200).json({
        success: true,
        doctors
    })

}

async function getUserDetails(req, res) {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    })

}

async function AdminLogout(req, res) {
    console.log('log',req.user);

    res.status(200).cookie("adminToken", '', { maxAge: 0, httpOnly: true }).json({
        success: true,
        message: 'logout success'
    })

}
async function PatientLogout(req, res) {

    res.status(200).cookie("patientToken", '', { maxAge: 0, httpOnly: true }).json({
        success: true,
        message: 'logout success'
    })

}


async function addNewDoctor(req, res) {
    const { firstName, lastName, email, phone, dob, department, experience, qualifications, timetable } = req.body;
    if (!firstName || !lastName || !email || !phone || !dob || !department || !timetable || !qualifications || !experience) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }
    // if (!req.files || Object.keys(req.files).length == 0) {
    //     throw new errorHandler.customError('Doctor avtar required', 400)
    // }
    // const { docAvtar } = req.files;
    // const validFormets = ["image/png", "image/jpeg"]
    // if (!validFormets.includes(docAvtar.mimetype)) {
    //     throw new errorHandler.customError('File format not supported', 400)
    // }

    const password = crypto.randomBytes(8).toString('hex');

    const isDoctorRegistered = await Doctor.findOne({ email: email });
    if (isDoctorRegistered) {
        throw new errorHandler.customError(`${isDoctorRegistered.role} already registerd`, 400)
    }

    // const cloudRes= await cloud.uploader.upload(docAvtar.tempFilePath)

    // if(!cloudRes ||cloudRes.error){
    //     console.log('error')
    // }

    const doctor = await Doctor.create({ firstName, lastName, email, password, phone, dob, department, experience, qualifications, timetable });
    const x = await Slot.create({ doctorId: doctor.id });
    try {
        await Deparment.findOneAndUpdate({ name: doctor.department }, { $push: { doctorsList: doctor.id } }, { new: true, useFindAndModify: false });

    } catch (error) {
        console.log(error)
    }


    res.status(200).json({ success: true, message: "new Doctor registored" })

}

async function getDepartment_doctor(req, res) {
   
    const department = await Deparment.find().populate('doctorsList');


    res.status(200).json({
        success: true, department:department
    })
}
async function authCheckPatient(req, res) {
    res.status(200).json({ success: true });


}

async function addDeparment(req, res) {

    const { name } = req.body;

    if (!name) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }

    await Deparment.create({ name });

    res.status(200).json({
        success: 'true'
        , message: 'Deparment added successfully'
    })

}
async function getADoctor(req, res) {
    req.params
}
async function getSlots(req, res) {

    const { id, dateX } = req.body;
    console.log("date:",req.body);

    

   
    try {
        const slotDocs = await Slot.find({ doctorId: id });
        console.log('slots of doc:',slotDocs)
        let slotsForDate = [];

        // Loop through each document to find matching date slots
        slotDocs.forEach(slotDoc => {
            if (slotDoc.slots && Array.isArray(slotDoc.slots)) {
                console.log('kadjkasdsa')
                const matchingSlots = slotDoc.slots.filter(slot => {
                    // Compare the dates by stripping the time part
                    console.log('ok:',new Date(slot.date).toDateString(),"osdasd:",new Date(dateX).toDateString())
                    return new Date(slot.date).toDateString() === new Date(dateX).toDateString();
                });
                slotsForDate.push(...matchingSlots);
            }
        });

        // const slotsForDate = slotDoc.slots.filter(slot => {
        //     // Compare the dates by stripping the time part
        //     return slot.date.toDateString() === date;
        // });
        console.log(slotsForDate)
        let bookedSlots=[];
        slotsForDate.forEach(element => {
           bookedSlots.push(element.time) 
        });
    
        res.status(200).json({
            Xslot:bookedSlots
            ,success:true
        })
       

    } catch (error) {
        console.log(error)

    }


}

module.exports.getSlots=responseHandler(getSlots)
module.exports.getADoctor = responseHandler(getADoctor);

module.exports.addDeparment = responseHandler(addDeparment);
module.exports.authCheckPatient = responseHandler(authCheckPatient);
module.exports.getDepartment_doctor = responseHandler(getDepartment_doctor);
module.exports.addNewDoctor = responseHandler(addNewDoctor)
module.exports.PatientLogout = responseHandler(PatientLogout);
module.exports.AdminLogout = responseHandler(AdminLogout);
module.exports.getUserDetails = responseHandler(getUserDetails);
module.exports.getAllDoctors = responseHandler(getAllDoctors);
module.exports.addAdmin = responseHandler(addAdmin);
module.exports.login = responseHandler(login);

module.exports.newPatientRegistor = responseHandler(PatientRegistor);