const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/hospital_db');
// mongoose.connect('mongodb+srv://shubhcode8178:9910549321ss@cluster0.oajgs.mongodb.net/');

 const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb+srv://shubhcode8178:9910549321ss@cluster0.oajgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('coonected to db')
    } catch (error) {
        console.log('error', error)

    }
} 

// const uri = "mongodb+srv://shubhcode8178:9910549321ss@cluster0.oajgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

module.exports =dbConnection;