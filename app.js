const express=require('express');
const app=express();
const eVar=require('dotenv');
const cors=require('cors')
app.use(express.urlencoded({extended:true}))
const cookie_parser=require('cookie-parser')
const db=require('./config/database')
const messageRouter=require('./router/index')
const errorMiddelware=require('./utils/responseHandler')
const userRouter=require('./router/userROuter')
const appointRouter=require('./router/appointmentRouter')
const fileUpload=require('express-fileupload');

// connecting database
db();


// The config() method in the dotenv package is used to load environment variables from a .env file into the process.env
eVar.config();
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:[],
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}))


// The cookie-parser package is a middleware for Node.js that parses cookies attached to the client request object. It populates the req.cookies property with an object keyed by the cookie names. 
app.use(cookie_parser());

// fileupload  >>>>
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/temp/'
}))

const cloudniary=require('cloudinary').v2;
cloudniary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    
})

app.use('/api/v1/message',messageRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/appointment',appointRouter)

app.listen(process.env.PORT,(err)=>{
    console.log('port:',process.env.PORT);
})

