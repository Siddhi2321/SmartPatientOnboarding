const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const PatientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        unique: true,
        default: () => `PID-${nanoid()}`,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
    },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);