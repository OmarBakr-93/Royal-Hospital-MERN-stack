const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctorSchema');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images')
  },
  filename: function (req, file, cb) {

      const ext = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
})

const upload = multer({ storage: storage })


/**
 * @route POST /doctors
 * @desc Create a new doctor
 * @access Public
 * @body {name, specialization, experience, description}
 */
router.post('/addDoctor', upload.single('image'), async (req, res) => {
  try {
    const { name, specialization, experience, description } = req.body;
    const image = req.file ? req.file.filename : null
    if (!name || !specialization || !experience || !description || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingDoctor = await Doctor.findOne({ name });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }
    const newDoctor = new Doctor({ name, specialization, experience, description, image:req.file?.filename });
    const savedDoctor = await newDoctor.save();
    return res.status(201).json({ message: 'Doctor created successfully', doctor: savedDoctor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route GET /doctors
 * @desc Get all doctors
 * @access Public
 */

router.get('/allDoctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /doctors/:id
 * @desc Get a doctor by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.status(200).json({ doctor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route PUT /doctors/:id
 * @desc Update a doctor by ID
 * @access Public
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experience, description } = req.body;
    const image = req.file ? req.file.filename : null
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctor.name = name || doctor.name;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.description = description || doctor.description;
    doctor.image = image || doctor.image;
    const updatedDoctor = await doctor.save();
    return res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route DELETE /doctors/:id
 * @desc Delete a doctor by ID
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
