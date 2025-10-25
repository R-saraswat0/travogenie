const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation email
const sendBookingConfirmation = async (userEmail, userName, bookingDetails) => {
  try {
    // Check if email credentials are properly configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'travogenie.bookings@gmail.com' || 
        process.env.EMAIL_PASS === 'your_gmail_app_password') {
      console.log('📧 EMAIL DEMO MODE - Would send to:', userEmail);
      console.log('📋 Booking Details:', {
        package: bookingDetails.packageTitle,
        destination: bookingDetails.destination,
        bookingId: bookingDetails.bookingId,
        amount: `₹${bookingDetails.totalAmount.toLocaleString('en-IN')}`
      });
      return { success: true, demo: true };
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🎉 Booking Confirmed - TravOgenie',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1E90FF, #2ECC71); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your dream trip is booked with TravOgenie</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2a4365; margin-bottom: 20px;">Hello ${userName}! 👋</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Great news! Your booking has been confirmed and payment has been processed successfully.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1E90FF;">
              <h3 style="color: #2a4365; margin: 0 0 15px 0;">📋 Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Package:</td>
                  <td style="padding: 8px 0; color: #2a4365;">${bookingDetails.packageTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Destination:</td>
                  <td style="padding: 8px 0; color: #2a4365;">📍 ${bookingDetails.destination}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Booking ID:</td>
                  <td style="padding: 8px 0; color: #2a4365; font-family: monospace;">${bookingDetails.bookingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Travel Date:</td>
                  <td style="padding: 8px 0; color: #2a4365;">🗓️ ${bookingDetails.startDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Travelers:</td>
                  <td style="padding: 8px 0; color: #2a4365;">👥 ${bookingDetails.travelers} person(s)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #2ECC71; font-weight: bold; font-size: 18px;">₹${bookingDetails.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: bold;">Payment Status:</td>
                  <td style="padding: 8px 0; color: #2ECC71; font-weight: bold;">✅ Paid</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2ECC71;">
              <h3 style="color: #2a4365; margin: 0 0 10px 0;">📞 Need Help?</h3>
              <p style="color: #4a5568; margin: 0; line-height: 1.6;">
                If you have any questions about your booking, feel free to contact our support team at 
                <a href="mailto:support@travogenie.com" style="color: #1E90FF;">support@travogenie.com</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #4a5568; margin: 0;">Thank you for choosing TravOgenie! 🌟</p>
              <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">
                This is an automated email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent successfully to:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    // Fallback to demo mode if email fails
    console.log('📧 EMAIL FALLBACK - Booking details for:', userEmail);
    console.log('📋 Package:', bookingDetails.packageTitle, '| Amount: ₹' + bookingDetails.totalAmount.toLocaleString('en-IN'));
    return { success: false, error: error.message, fallback: true };
  }
};

module.exports = {
  sendBookingConfirmation
};