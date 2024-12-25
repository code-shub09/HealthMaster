const express = require('express');
const app = express();
const eVar = require('dotenv');
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const db = require('./config/database');
const messageRouter = require('./router/index');
const doctorRouter = require('./router/doctorRouter');
const pateintAdminRouter = require('./router/userROuter');
const appointRouter = require('./router/appointmentRouter');
const startCronJobs = require('./models/appointment-cron');

eVar.config();
db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified CORS configuration
const allowedOrigins = [
    "https://luxury-squirrel-9c64f8.netlify.app/",
    "https://doctor-dash-board.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));




// Middleware for parsing cookies
app.use(cookie_parser());

// Log requests and cookies
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log("Cookies received:", req.cookies);
    next();
});

// Route handlers
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', pateintAdminRouter);
app.use('/api/v1/appointment', appointRouter);
app.use('/api/v1/doctor', doctorRouter);

// Catch-all route
app.get('*', (req, res) => {
    res.status(404).send('API only: Frontend hosted separately');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
