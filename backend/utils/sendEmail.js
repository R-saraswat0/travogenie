const nodemailer = require("nodemailer");

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('📧 EMAIL DEMO MODE - Credentials not configured');
        return null;
    }
    
    return nodemailer.createTransporter({
        service: "gmail",
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

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
        
        const transporter = createTransporter();
        
        if (!transporter) {
            console.log('📧 EMAIL DEMO - Would send to:', to);
            console.log('Subject:', subject);
            return;
        }
        
        const sanitizedSubject = subject.replace(/[\r\n]/g, '');
        const sanitizedText = text.replace(/[\r\n]/g, ' ');
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to.trim(),
            subject: sanitizedSubject,
            text: sanitizedText
        });
        
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        console.log('📧 FALLBACK - Email logged above');
    }
}

module.exports = sendEmail;