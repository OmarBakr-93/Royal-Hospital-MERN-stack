const express = require("express");
const router = express.Router();
const Appointment = require("../models/AppointmentSchema");
const auth = require("../auth/Middleware");


/**
 * Route to create a new appointment
 * @route POST /appointments
 * @access Private
 * @description Creates a new appointment
 */
router.post("/create", auth,async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;
    if(!doctor || !date || !reason){
      return res.status(400).json({ message: "All fields are required" });
    }
    const newAppointment = await Appointment.create({
      doctor,
      date,
      reason,
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Route to get all appointments
 * @route GET /appointments
 * @access Private
 * @description Gets all appointments
 */
router.get("/myAppointments", auth,async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate("doctor");
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



/**
 * Route to Delete a single appointment
 * @route GET /appointments/:id
 * @access Private
 * @description Deletes a single appointment
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

