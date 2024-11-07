// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.']
  },
  stream: {
    type: String,
    required: true,
    enum: [
      "Engineering", "Management", "Commerce & Banking", "Medical", "Sciences",
      "Hotel Management", "IT", "Arts & Humanities", "Mass Communication",
      "Nursing", "Agriculture", "Design", "Law", "Pharmacy", "Paramedical", 
      "Dental", "Performing Arts", "Education"
    ],
  },
  level: {
    type: String,
    required: true,
    enum: ["Undergraduate", "Postgraduate", "Diploma", "Doctorate"]
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
