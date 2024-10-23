const mongoose = require('mongoose');

// Define the schema for a user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true }, // Ensure valid values for gender (consider enum for specific options)
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  password: { type: String, required: true, minlength: 6 } // Minimum length for password security
});

// Use the 'Color' collection to store user data
const userModel = mongoose.model("users",userSchema)

module.exports = {userModel};
