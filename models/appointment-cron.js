const cron = require('node-cron');
// const cron = require('node-cron');
const Appointment = require('./appoinment'); // Import your appointment model

// Schedule the job to run every day at midnight
const startCronJobs = () => {
    // Schedule the job to run every day at midnight
    console.log("Cron jobs initialized...");
    cron.schedule('10 00 * * *', async () => {
        console.log('Checking for expired ----xxxxxx---...');

        try {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
            const currentTime = now.toISOString().split('T')[1].split('.')[0]; // HH:mm:ss format

            // Update all pending appointments where the date and time have passed
            const result = await Appointment.updateMany(
                {
                    $or: [
                        { "appointmentDate.date": { $lt: currentDate } },
                        {
                            $and: [
                                { "appointmentDate.date": { $eq: currentDate } },
                                { "appointmentDate.time": { $lt: currentTime } }
                            ]
                        }
                    ],
                    status: "Pending"
                },
                { $set: { status: "Unattended" } }
            );

            console.log(`Updated ${result.modifiedCount} expired appointments.`);
        } catch (error) {
            console.error('Error updating expired appointments:', error);
        }
    });
};

// Export the start function
module.exports = startCronJobs;