const nodemailer = require('nodemailer');

/**
 * Utility function to send transactional emails using Nodemailer.
 * Supports HTML templates for enterprise-grade alert layouts.
 * 
 * @param {Object} options - The email configuration options.
 * @param {string} options.email - Recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} options.html - HTML body content.
 */
const sendEmail = async (options) => {
  // Create a reusable transporter using the SMTP configuration from .env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Merkato Store" <noreply@merkato.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email Transporter Error: ${error.message}`);
    throw new Error('Email could not be sent.');
  }
};

module.exports = sendEmail;