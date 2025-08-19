const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    diagnosis: { type: String, default: '' },
    prescription: { type: String, default: '' },
    notes: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
}, { _id: false });

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required at the time of booking'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required at the time of booking'],
        enum: ['Male', 'Female', 'Other'],
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    appointmentDateTime: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending',
    },
    medicalRecord: {
        type: MedicalRecordSchema,
        default: () => ({})
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

