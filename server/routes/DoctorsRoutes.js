const express = require("express");
const router = express.Router();
const Doctor = require("../models/DoctorSchema");
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {

      const ext = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
})

const upload = multer({ storage: storage })



/**
 * Route to get all doctors
 * @route GET /doctors
 * @access Public
 * @description Gets all doctors
 */

router.get("/allDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}); 



/**
 * Route to create a new doctor
 * @route POST /doctors
 * @access Public
 * @description Creates a new doctor
 */
router.post("/addDoctor", upload.single('image'),async (req, res) => {
  try {
    const { name, specialization, description, experience } = req.body;
    const image = req.file ? req.file.filename : null

    if(!name || !specialization || !description || !experience){
      return res.status(400).json({ message: "All fields are required" });
    }
    const newDoctor = await Doctor.create({
      name,
      specialization,
      image:req.file?.filename,
      description,
      experience
    });
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * Route to Count the number of doctors
 * @route GET /doctors/count
 * @access Public
 * @description Counts the number of doctors
 */

router.get("/count",async(req,res)=>{
  try {
    const count = await Doctor.countDocuments()
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors count" });
  }
})


/**
 * Route to get a single doctor
 * @route GET /doctors/:id
 * @access Public
 * @description Gets a single doctor
 * 
 */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Route to get doctors by specialty
 * @route GET /doctors/bySpecialty/:specialty
 * @access Public
 * @description Gets doctors by specialty
 */

router.get("/doctors/bySpecialty/:specialty",async(req,res)=>{
  try {
    const {specialty} = req.params;
    const doctors = await Doctor.find({
      specialty : { $regex: new RegExp(specialty, 'i')}
    })

    console.log('Found doctors:', doctors.length);
    res.json(doctors);
  } catch (error) {
      console.error("error",error)
      res.status(500).json({message:error.message})
  }

})

module.exports = router;
