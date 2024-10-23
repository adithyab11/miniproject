const mongoose = require('mongoose');

// Define the member schema for each booking
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  star: {
    type: String,
    required: [true, 'Star is required.']
  },
  date: {
    type: Date,
    required: [true, 'Date is required.']
  },
  vazhipadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vazhipads',  // Refers to the 'vazhipads' collection/model
    required: [true, 'Vazhipad ID is required.']
  },
  price: {
    type: Number,
    required: [true, 'Price is required.']
  }
});

// Define the vazhipad booking schema
const vazhipadbookingSchema = new mongoose.Schema({
  members: [memberSchema]  // Array of members in a single booking
});

// Create the booking model
const vazhipadbookingModel = mongoose.model('vazhipadBooking', vazhipadbookingSchema);

module.exports = { vazhipadbookingModel };
