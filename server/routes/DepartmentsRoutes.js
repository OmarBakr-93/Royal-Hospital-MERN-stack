const express = require("express");
const router = express.Router();
const Department = require("../models/DepartmentSchema");
const auth = require("../auth/Middleware");
const multer = require('multer')



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


/**
 * Route Create a new appointment
 * @route POST /appointments
 * @access Private
 * @description Creates a new appointment
 */

router.post("/create", auth("admin"),upload.single('image'),async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;
    if(!name || !description){
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }
    const newDepartment = await Department.create({
      name,
      description,
      image: req.file?.filename
    });
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Route to get all departments
 * @route GET /departments
 * @access Public
 * @description Gets all departments
 */

router.get("/allDepartments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * Route to get a count of departments
 * @route GET /departments
 * @access Public
 * @description Gets a count of departments
 * 
 */

router.get("/count",async(req,res)=>{
  try {
    const count = await Department.countDocuments()
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments count" });
  }
})


module.exports = router;