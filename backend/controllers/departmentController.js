const Department = require('../models/Department');

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    const { name, description } = req.body;

    try {
        const departmentExists = await Department.findOne({ name });
        if (departmentExists) {
            return res.status(400).json({ message: 'Department already exists' });
        }

        const department = await Department.create({ name, description });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

module.exports = { createDepartment, getAllDepartments };