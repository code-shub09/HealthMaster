const express=require('express');
const app=express();
const eVar=require('dotenv');
const cors=require('cors')
const cookie_parser=require('cookie-parser')
const db=require('./config/database')

// connecting database
db();

// The config() method in the dotenv package is used to load environment variables from a .env file into the process.env
eVar.config();

app.use(cors({
    origin:[],
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}))


// The cookie-parser package is a middleware for Node.js that parses cookies attached to the client request object. It populates the req.cookies property with an object keyed by the cookie names. 
app.use(cookie_parser());
app.use(express.urlencoded({extended:true}))
// fileupload  >>>>



app.listen(process.env.PORT,(err)=>{
    console.log('port:',process.env.PORT);
})