const express = require('express');
const router = express.Router();
const Department = require('../models/departmentSchema');
const multer = require('multer');
const authMiddleware = require('../auth/Middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/departments')
  },
  filename: function (req, file, cb) {

      const ext = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
})

const upload = multer({ storage: storage })



/**
 * @route POST /departments
 * @desc Create a new department
 * @access Public
 */
router.post('/create', upload.single('image'), authMiddleware("Admin") , async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }
    const newDepartment = Department.create({ name, description, image:req.file?.filename });
    res.status(201).json({ message: 'Department created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});






module.exports = router;