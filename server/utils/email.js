const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"ShikshaVid" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Email templates
const bookingConfirmationStudent = (studentName, teacherName, date, time, subject) => ({
  subject: '✅ Demo Class Booked - ShikshaVid',
  html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📚 ShikshaVid</h1>
        <p style="color: #e0e7ff; margin-top: 8px;">Your Learning Journey Begins!</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1e293b;">Hi ${studentName}! 🎉</h2>
        <p style="color: #475569;">Your demo class has been booked successfully.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
          <p style="margin: 4px 0;"><strong>👨‍🏫 Teacher:</strong> ${teacherName}</p>
          <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${time}</p>
          ${subject ? `<p style="margin: 4px 0;"><strong>📖 Subject:</strong> ${subject}</p>` : ''}
        </div>
        <p style="color: #64748b; font-size: 14px;">The teacher will confirm your booking shortly.</p>
      </div>
    </div>
  `
});

const bookingNotificationTeacher = (teacherName, studentName, date, time, subject) => ({
  subject: '🔔 New Demo Class Booking - ShikshaVid',
  html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📚 ShikshaVid</h1>
        <p style="color: #d1fae5; margin-top: 8px;">New Booking Alert!</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1e293b;">Hi ${teacherName}! 📣</h2>
        <p style="color: #475569;">You have a new demo class booking request.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #059669;">
          <p style="margin: 4px 0;"><strong>🎓 Student:</strong> ${studentName}</p>
          <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${time}</p>
          ${subject ? `<p style="margin: 4px 0;"><strong>📖 Subject:</strong> ${subject}</p>` : ''}
        </div>
        <p style="color: #64748b; font-size: 14px;">Please confirm or respond to this booking.</p>
      </div>
    </div>
  `
});

const contactFormEmail = (name, email, message) => ({
  subject: `📩 New Contact Form Submission from ${name}`,
  html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0;">📬 New Contact Form Submission</h1>
      </div>
      <div style="padding: 32px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 12px;">
          <p><strong>Message:</strong></p>
          <p style="color: #475569;">${message}</p>
        </div>
      </div>
    </div>
  `
});

module.exports = { 
  sendEmail, 
  bookingConfirmationStudent, 
  bookingNotificationTeacher, 
  contactFormEmail 
};
