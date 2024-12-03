import nodemailer from 'nodemailer';

// Create the transporter


const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'smtp.example.com'
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Utility function to send OTP email
export const sendOTPEmail = async (recipient, otp, subject) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: recipient,
            subject,
            text: otp,
            html: `<p>Your OTP is: <strong>${otp} . Valid for 10 minutes</strong></p>`, // HTML support
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
