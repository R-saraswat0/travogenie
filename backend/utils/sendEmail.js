const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: true
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function sendEmail(to, subject, text) {
    try {
        if (!to || !subject || !text) {
            throw new Error('Missing required email parameters');
        }
        
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        
        const sanitizedSubject = subject.replace(/[\r\n]/g, '');
        const sanitizedText = text.replace(/[\r\n]/g, ' ');
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to.trim(),
            subject: sanitizedSubject,
            text: sanitizedText
        });
        
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw new Error('Failed to send email');
    }
}

module.exports = sendEmail;
