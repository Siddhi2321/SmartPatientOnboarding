const Staff = require('../models/Staff');
const Department = require('../models/Department');
const generateToken = require('../utils/generateToken');

// @desc    Register a new staff member
// @route   POST /api/auth/register
// @access  Public (for now, should be Admin in production)
const registerStaff = async (req, res) => {
    const { staffId, firstName, lastName, email, password, departmentName, role } = req.body;

    try {
        const staffExists = await Staff.findOne({ email });
        if (staffExists) {
            return res.status(400).json({ message: 'Staff member already exists' });
        }

        const department = await Department.findOne({ name: departmentName });
        if (!department) {
            return res.status(400).json({ message: 'Department not found' });
        }

        const staff = await Staff.create({
            staffId,
            firstName,
            lastName,
            email,
            password,
            department: department._id,
            role
        });

        if (staff) {
            res.status(201).json({
                _id: staff._id,
                staffId: staff.staffId,
                name: `${staff.firstName} ${staff.lastName}`,
                email: staff.email,
                role: staff.role,
                token: generateToken(staff._id, staff.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid staff data' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Auth staff & get token
// @route   POST /api/auth/login
// @access  Public
const loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await Staff.findOne({ email }).select('+password').populate('department', 'name');
        
        if (staff && (await staff.matchPassword(password))) {
            res.json({
                _id: staff._id,
                staffId: staff.staffId,
                name: `${staff.firstName} ${staff.lastName}`,
                email: staff.email,
                role: staff.role,
                department: staff.department.name,
                token: generateToken(staff._id, staff.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get staff profile
// @route   GET /api/auth/profile
// @access  Private
const getStaffProfile = async (req, res) => {
    try {
        const staff = await Staff.findById(req.staff._id).populate('department', 'name');
        if (staff) {
            res.json({
                 _id: staff._id,
                staffId: staff.staffId,
                name: `${staff.firstName} ${staff.lastName}`,
                email: staff.email,
                role: staff.role,
                department: staff.department.name,
            });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
         res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { registerStaff, loginStaff, getStaffProfile };