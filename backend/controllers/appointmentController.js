const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Department = require('../models/Department');

// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        departmentName,
        appointmentDateTime,
        reason
    } = req.body;

    if (!gender) {
        return res.status(400).json({ message: 'Gender is a required field.' });
    }

    try {
        const department = await Department.findOne({ name: departmentName });
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        let patient = await Patient.findOne({ email });
        if (!patient) {
            patient = await Patient.create({
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth,
                gender,
                address,
                emergencyContact
            });
        }

        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        const appointment = await Appointment.create({
            patient: patient._id,
            age: age,            
            gender: patient.gender,
            department: department._id,
            appointmentDateTime,
            reason,
        });

        res.status(201).json({
            message: 'Appointment booked successfully!',
            patientId: patient.patientId,
            appointment,
        });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get all appointments for the logged-in staff's department
// @route   GET /api/appointments/department
// @access  Private/Staff
const getDepartmentAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ department: req.staff.department })
            .populate('patient', 'firstName lastName email patientId')
            .populate('department', 'name')
            .sort({ status: 1, appointmentDateTime: 1 }); // Sort by status then date

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @route   PUT /api/appointments/:id/status
// @access  Private/Staff
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body; // Expecting 'approved' or 'rejected'

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            // Optional: Check if staff belongs to the correct department
            if (appointment.department.toString() !== req.staff.department.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this appointment' });
            }
            appointment.status = status;
            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


// @route   PUT /api/appointments/:id/record
// @access  Private/Staff
const updateMedicalRecord = async (req, res) => {
    const { diagnosis, prescription, notes } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            if (appointment.department.toString() !== req.staff.department.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this appointment' });
            }
            
            appointment.medicalRecord.diagnosis = diagnosis || appointment.medicalRecord.diagnosis;
            appointment.medicalRecord.prescription = prescription || appointment.medicalRecord.prescription;
            appointment.medicalRecord.notes = notes || appointment.medicalRecord.notes;
            appointment.medicalRecord.updatedBy = req.staff._id;
            
            // Mark appointment as completed when record is updated
            appointment.status = 'completed';

            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


module.exports = {
    createAppointment,
    getDepartmentAppointments,
    updateAppointmentStatus,
    updateMedicalRecord
};