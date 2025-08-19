const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// @desc    Get patient by their unique patient ID
// @route   GET /api/patients/:patientId
// @access  Private/Staff
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.params.patientId });

        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get patient details along with all their past appointments
// @route   GET /api/patients/details/:patientId
// @access  Private/Staff
const getPatientWithAppointments = async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.params.patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const appointments = await Appointment.find({ patient: patient._id })
            .populate('department', 'name')
            .populate('medicalRecord.updatedBy', 'firstName lastName')
            .sort({ appointmentDateTime: -1 });

        res.json({
            patientDetails: patient,
            appointments: appointments,
        });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { getPatientById, getPatientWithAppointments };