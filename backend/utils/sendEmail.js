const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API
);

const SENDER_EMAIL = "siddhi280921@gmail.com";
const SENDER_NAME = "SmartPatientOnboarding";



const sendVerificationEmail = async ({ toEmail, otp }) => {
    const sender = { name: `${SENDER_NAME} Verification`, email: SENDER_EMAIL };
    const receivers = [{ email: toEmail }];

    const subject = "Your Verification Code";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Email Verification</h2>
            <p>Thank you for starting your appointment booking process. Please use the following One-Time Password (OTP) to verify your email address.</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0056b3;">${otp}</p>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
    `;
    const textContent = `Your verification code is: ${otp}`;

    try {
        const response = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject,
            htmlContent,
            textContent,
        });
        console.log("Verification email sent successfully.");
        return response;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};


module.exports = {
  sendVerificationEmail
};