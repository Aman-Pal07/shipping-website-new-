const nodemailer = require("nodemailer");

/**
 * Send an email using nodemailer
 * @param options Email options including recipient, subject, and content
 */
const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

/**
 * Generate a random 6-digit verification code
 * @returns A string containing a 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send a verification code email to a user
 * @param email User's email address
 * @param code Verification code
 */
const sendVerificationEmail = async (email, code) => {
  const subject = "Your Verification Code for Package Tracker";
  const text = `Your verification code is: ${code}. This code will expire in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a4a4a;">Package Tracker Verification</h2>
      <p>Thank you for registering with Package Tracker. To complete your registration, please use the following verification code:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send an email update verification code to a user
 * @param email User's new email address
 * @param code Verification code
 */
const sendEmailUpdateVerification = async (email, code) => {
  const subject = "Verify Your New Email Address";
  const text = `Your email update verification code is: ${code}. This code will expire in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a4a4a;">Email Update Request</h2>
      <p>You have requested to update your email address. Please use the following verification code to confirm this change:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this change, please secure your account immediately as someone else may be trying to access it.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail({ to: email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendEmailUpdateVerification,
  generateVerificationCode,
};
