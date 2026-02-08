const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://www.pngall.com/wp-content/uploads/5/Department-Icon-PNG-Picture.png",
  },
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;