const express = require('express');
const router = express.Router();
const { Appointment } = require('../models/appointmentSchema');
const authMiddleware = require('../auth/Middleware');


/**
 * @route POST /appointments
 * @desc Create a new appointment
 * @access Private
 */
router.post('/addAppointment', authMiddleware, async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;
    if ( !doctor || !date || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newAppointment = new Appointment({
      user: req.user.id,
      doctor,
      date,
      reason
    });
    if (!newAppointment) {
      return res.status(400).json({ message: 'Failed to create appointment' });
    }
    if (newAppointment.date < new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route GET /appointments
 * @desc Get all appointments
 * @access Private
 */
router.get('/myAppointments', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({user:req.user.id}).populate('doctor');
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



/**
 * @route DELETE /appointments/:id
 * @desc Delete an appointment
 * @access Private
 */
router.delete('/deleteAppointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;