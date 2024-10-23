const mongoose = require('mongoose');

const ceremonySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users', // Assuming you have a User model
    },
    babyName: String,
    fatherName: String,
    motherName: String,
    eventName: String,
    eventPrice: String,
    date: String,
    timeSlot: String,
  });
  
  const ceremonyModel = mongoose.model('Ceremony', ceremonySchema);
  
module.exports = {ceremonyModel};
