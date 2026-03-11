const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const connectDB = require("./config/DB_connect");
connectDB();

// Routes
const userRoutes = require("./routes/UsersRoutes");
app.use("/users", userRoutes);

const doctorRoutes = require("./routes/DoctorsRoutes");
app.use("/doctors", doctorRoutes);

const appointmentRoutes = require("./routes/AppointmentsRoutes");
app.use("/appointments", appointmentRoutes);

const departmentRoutes = require("./routes/DepartmentsRoutes");
app.use("/departments", departmentRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});