const mongoose = require('mongoose');

const DarshanBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users', // Assuming you have a User model
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    membersCount: {
        type: Number,
        required: true,
        min: 1,
    },
    // Add other fields as necessary
}, { timestamps: true });

const darshanModel = mongoose.model('darshans', DarshanBookingSchema);
module.exports = darshanModel;
