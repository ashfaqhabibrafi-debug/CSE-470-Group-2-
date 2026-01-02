const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    // Only send if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Skipping email send.');
      console.log('Would send to:', to);
      console.log('Subject:', subject);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"Disaster Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send emergency alert email
const sendEmergencyAlert = async (userEmail, userName, disaster) => {
  const subject = `🚨 Emergency Alert: ${disaster.title}`;
  const text = `
Emergency Alert - Disaster Verified

Dear ${userName},

A disaster has been verified in your area:

Title: ${disaster.title}
Type: ${disaster.type}
Severity: ${disaster.severity}
Location: ${disaster.location.address || disaster.location.city || 'See details in system'}

Description:
${disaster.description}

Please take necessary precautions and stay safe.

For more details, please log in to the Disaster Management System.

Stay Safe,
Disaster Management Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">🚨 Emergency Alert: ${disaster.title}</h2>
      <p>Dear ${userName},</p>
      <p>A disaster has been verified in your area:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Title:</strong> ${disaster.title}</p>
        <p><strong>Type:</strong> ${disaster.type}</p>
        <p><strong>Severity:</strong> <span style="color: ${disaster.severity === 'critical' ? '#d32f2f' : disaster.severity === 'high' ? '#f57c00' : '#666'}">${disaster.severity}</span></p>
        <p><strong>Location:</strong> ${disaster.location.address || disaster.location.city || 'See details in system'}</p>
      </div>
      <p><strong>Description:</strong></p>
      <p>${disaster.description}</p>
      <p style="color: #d32f2f; font-weight: bold;">Please take necessary precautions and stay safe.</p>
      <p>For more details, please log in to the Disaster Management System.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Stay Safe,<br>Disaster Management Team</p>
    </div>
  `;

  return sendEmail(userEmail, subject, text, html);
};

module.exports = {
  sendEmail,
  sendEmergencyAlert,
};

