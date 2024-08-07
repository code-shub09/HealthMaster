const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/hospital_db')

 const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hospital_db')
        console.log('coonected to db')
    } catch (error) {
        console.log('error', error)

    }


} 

module.exports =dbConnection;