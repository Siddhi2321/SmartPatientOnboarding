const Otp = require('../models/Otp');
const { sendVerificationEmail } = require('../utils/sendEmail');

// @route   POST /api/verification/send-otp
const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        await Otp.deleteOne({ email: email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = new Otp({
            email: email,
            otp: otp, 
        });

        await newOtp.save();

        await sendVerificationEmail({ toEmail: email, otp });

        res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });

    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
};

// @route   POST /api/verification/verify-otp
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        // Find the OTP in the database
        const storedOtp = await Otp.findOne({ email: email });
        if (!storedOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
        }

        if (storedOtp.otp === otp) {
            await Otp.deleteOne({ email: email });
            res.status(200).json({ message: 'Email verified successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
};