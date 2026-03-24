import nodemailer from 'nodemailer';

export const sendOTPVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"AI Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your AI Chat Verification Code',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f13; padding: 40px; border-radius: 10px; color: #ffffff; text-align: center; border: 1px solid rgba(124,58,237,0.2);">
                <h2 style="color: #ffffff; font-weight: 600; margin-bottom: 20px;">Welcome to AI Assistant Chat!</h2>
                <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 30px; line-height: 1.5;">
                    Please use the following 6-digit verification code to complete your registration. This code will automatically expire in 10 minutes.
                </p>
                <div style="background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.1)); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid rgba(124,58,237,0.3);">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #a78bfa;">${otp}</span>
                </div>
                <p style="color: rgba(255,255,255,0.5); font-size: 13px;">
                    If you did not request this verification code, please safely ignore this email.
                </p>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};
