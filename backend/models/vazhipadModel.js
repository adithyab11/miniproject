const mongoose = require('mongoose');

// Define the vazhipad schema
const vazhipadSchema = mongoose.Schema({
  vname: { type: String, required: true },  // Name of the vazhipad
  vprice: { type: String, required: true }  // Price of the vazhipad
});

// Define the model
const vazhipadModel = mongoose.model("vazhipads", vazhipadSchema);  // The collection name is 'vazhipads'

module.exports = { vazhipadModel };
