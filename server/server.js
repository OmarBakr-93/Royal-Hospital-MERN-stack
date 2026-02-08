const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/DB');
connectDB();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/files', express.static("uploads"))

const port = process.env.PORT || 3000;

// Routes
const User = require('./routes/usersRoutes');
app.use('/users', User);

const Doctor = require('./routes/doctorsRoutes');
app.use('/doctors', Doctor);

const Appointment = require('./routes/appointmentsRoutes');
app.use('/appointments', Appointment);

const Department = require('./routes/departmentsRoutes');
app.use('/departments', Department);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});