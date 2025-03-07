const nodemailer = require('nodemailer');
require('dotenv').config();

// Check if required environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_HOST) {
    console.error('Email configuration is missing. Please check your .env file');
    process.exit(1);
}

// Create a transporter using Hostinger SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,        // Your Hostinger mail server
    port: 465,                           // Hostinger SMTP port for SSL
    secure: true,                        // Use SSL
    auth: {
        user: process.env.EMAIL_USER,    // Your Hostinger email
        pass: process.env.EMAIL_PASSWORD // Your Hostinger email password
    }
});

// Verify transporter configuration immediately
(async function verifyTransporter() {
    try {
        await transporter.verify();
        console.log('SMTP server connection successful');
    } catch (error) {
        console.error('SMTP server connection failed:', error);
        console.error('Please check your Hostinger email credentials and settings');
        process.exit(1);
    }
})();

// Email templates with sanitized input
const emailTemplates = {
    registration: (userData) => ({
        subject: 'Welcome to SDMP Alumni Association',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B00;">Welcome to SDMP Alumni Association!</h2>
                <p>Dear ${escapeHtml(userData.fullName)},</p>
                <p>Thank you for registering with the SDMP Alumni Association. We're excited to have you as part of our community!</p>
                <p>Your account has been successfully created with the following details:</p>
                <ul>
                    <li>Alumni ID: ${escapeHtml(userData.alumniId)}</li>
                    <li>Email: ${escapeHtml(userData.email)}</li>
                    <li>Branch: ${escapeHtml(userData.branch)}</li>
                    <li>Graduation Year: ${escapeHtml(userData.graduationYear)}</li>
                </ul>
                <p>You can now log in to your account and:</p>
                <ul>
                    <li>Complete your profile</li>
                    <li>Connect with other alumni</li>
                    <li>Stay updated with college news and events</li>
                    <li>Participate in alumni activities</li>
                </ul>
                <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
                <p style="margin-top: 20px;">Best regards,<br>SDMP Alumni Association Team</p>
            </div>
        `
    }),

    passwordReset: (data) => ({
        subject: 'Reset Your SDMP Alumni Association Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B00;">Password Reset Request</h2>
                <p>Dear Alumni,</p>
                <p>We received a request to reset your password for the SDMP Alumni Association account. To proceed with the password reset, click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${escapeHtml(data.resetLink)}" 
                       style="background-color: #FF6B00; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 5px;
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    ${escapeHtml(data.resetLink)}
                </p>
                
                <p style="margin-top: 20px;">Best regards,<br>SDMP Alumni Association Team</p>
            </div>
        `
    }),

    broadcast: (data) => ({
        subject: data.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B00;">SDMP Alumni Association</h2>
                <div style="padding: 20px; background-color: #fff; border-radius: 5px;">
                    <p>Dear ${escapeHtml(data.recipientName || 'Alumni')},</p>
                    <p>Greetings from SDMP Alumni Association!</p>
                    <div style="margin: 20px 0;">
                        ${escapeHtml(data.message)}
                    </div>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                    This is a broadcast message from SDMP Alumni Association.
                    Please do not reply to this email.
                </p>
            </div>
        `
    })
};

// Helper function to escape HTML special characters
function escapeHtml(text) {
    if (!text) return '';
    return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Send email function with better error handling
const sendEmail = async (to, template, data) => {
    if (!to || !template || !data) {
        throw new Error('Missing required parameters for sending email');
    }

    try {
        const emailContent = emailTemplates[template](data);

        const mailOptions = {
            from: {
                name: 'SDMP Alumni Association',
                address: process.env.EMAIL_USER
            },
            to: to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', {
            error: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        throw error;
    }
};

module.exports = {
    sendEmail
}; 