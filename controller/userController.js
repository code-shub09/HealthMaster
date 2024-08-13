const Message = require('../models/message');
const responseHandler = require('../utils/responseHandler')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User');
const jwtX = require('../utils/jwtToken');
const cloud=require('cloudinary')
async function PatientRegistor(req, res) {

    const { firstName, lastName, email, phone, gender, dob, nic, password, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password || !role || !nic) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }



    const user = await User.findOne({ email: email });
    if (user) {
        throw new errorHandler.customError('user already exist', 400);
    }
    const newUser = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role });
    jwtX.GenerateToken(newUser, res, 'user registered successfully', 200)
}
async function login(req, res) {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !role) {
        throw new errorHandler.customError('pls enter login details correctly', 400);
    }



    const user = await User.findOne({ email: email });

    if (!user) {
        throw new errorHandler.customError('please sign up , user donot exist', 400);

    } else {
        if (password !== user.password) {
            throw new errorHandler.customError('Password  donot match', 400);

        }
    }

    jwtX.GenerateToken(user, res, 'user loggied suuessfuuly', 200)




}

async function addAdmin(req, res) {
    const { firstName, lastName, email, phone, gender, dob, nic, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password || !nic) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }
    const isRegisterd = await User.findOne({ email });

    if (isRegisterd) {
        throw new errorHandler.customError(`${isRegisterd.role}admin already registed`, 400);

    }
    const admin = await User.create({ firstName, lastName, email, phone, nic, dob, gender, password, role: 'Admin' })

    res.status(200).json({
        success: true,
        message: "New Admin Registered"
    })

}

async function getAllDoctors(req, res) {

    const doctors = await User.find({ role: "Doctor" });
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
    const { firstName, lastName, email, phone, gender, dob, nic, password, doctorDepartmnet } = req.body;
    if (!firstName || !lastName || !email || !phone || !gender || !dob || !password || !role || !nic || !doctorDepartmnet) {
        throw new errorHandler.customError('pls fill the form correctly', 400);
    }
    if (!req.files || Object.keys(req.files).length == 0) {
        throw new errorHandler.customError('Doctor avtar required', 400)
    }
    const { docAvtar } = req.files;
    const validFormets = ["image/png", "image/jpeg"]
    if (!validFormets.includes(docAvtar.mimetype)) {
        throw new errorHandler.customError('File format not supported', 400)
    }


    const isDoctorRegistered = await User.findOne({ email: email });
    if (isDoctorRegistered) {
        throw new errorHandler.customError(`${isDoctorRegistered.role} already registerd`, 400)
    }
   
    const cloudRes= await cloud.uploader.upload(docAvtar.tempFilePath)

    if(!cloudRes ||cloudRes.error){
        console.log('error')
    }

    const doctor= await User.create({firstName, lastName, email, phone,   nic,dob,gender, password,role:'Doctor', doctorDepartmnet,dovAvtar:{public_id:cloudRes.public_id,url:cloudRes.secure_url}})
    

    res.status(200).json({success:true,message:"new Doctor registored"})


}
module.exports.addNewDoctor=responseHandler(addNewDoctor)
module.exports.PatientLogout = responseHandler(PatientLogout);
module.exports.AdminLogout = responseHandler(AdminLogout);
module.exports.getUserDetails = responseHandler(getUserDetails);
module.exports.getAllDoctors = responseHandler(getAllDoctors);
module.exports.addAdmin = responseHandler(addAdmin);
module.exports.login = responseHandler(login);

module.exports.newPatientRegistor = responseHandler(PatientRegistor);