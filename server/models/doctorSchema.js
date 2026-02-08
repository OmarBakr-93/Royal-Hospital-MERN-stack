const mongoose = require('mongoose');
const joi = require('joi');


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '1.jpg'
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = { Doctor };