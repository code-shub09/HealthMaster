const express = require('express');
const app = express();
const eVar = require('dotenv');
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
const cookie_parser = require('cookie-parser')
const db = require('./config/database')
const messageRouter = require('./router/index')
const doctorRouter = require('./router/doctorRouter');
const errorMiddelware = require('./utils/responseHandler')
const pateintAdminRouter = require('./router/userROuter');
const appointRouter = require('./router/appointmentRouter')
const startCronJobs = require('./models/appointment-cron');
const path = require('path');

// const fileUpload = require('express-fileupload');

// connecting database
eVar.config();
db();



// The config() method in the dotenv package is used to load environment variables from a .env file into the process.env

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: ["https://health-master-patient.vercel.app",
//         process.env.DASHBOARD_URL, process.env.DOCTOR_DASHOBARD],
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],
//     credentials: true
// }))
const allowedOrigins = [
    "https://health-master-patient.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://health-master-patient.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



// The cookie-parser package is a middleware for Node.js that parses cookies attached to the client request object. It populates the req.cookies property with an object keyed by the cookie names. 
app.use(cookie_parser());

// coomented fileupload bcz it causing problem with multer setup

// fileupload  >>>>
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/temp/'
// }))

startCronJobs();
app.use((req, res, next) => {

    next();
});
app.get('*', (req, res) => {
    res.status(404).send('API only: Frontend hosted separately');
});
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', pateintAdminRouter);
app.use('/api/v1/appointment', appointRouter)
app.use('/api/v1/doctor', doctorRouter)
// Catch-all route to serve React app


app.listen(process.env.PORT, (err) => {
    // console.log('port:', process.env.PORT);
})

