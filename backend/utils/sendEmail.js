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
      tls: {
        rejectUnauthorized: false // Only for development, remove in production
      },
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
  const subject = "Your Verification Code for ParcelUp";
  const text = `Your verification code is: ${code}. This code will expire in 10 minutes.`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ParcelUp Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: white; display: inline-block; padding: 20px 40px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="margin: 0; color: #667eea; font-size: 32px; font-weight: 700; letter-spacing: 2px;">ParcelUp</h1>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px; font-weight: 500;">PACKAGE TRACKING MADE SIMPLE</p>
                </div>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
                <!-- Decorative Elements -->
                <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                
                <div style="position: relative; z-index: 1;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 50px; margin-bottom: 20px;">
                            <div style="background: white; padding: 15px 25px; border-radius: 50px;">
                                <span style="font-size: 24px;">📦</span>
                            </div>
                        </div>
                        <h2 style="color: #2d3748; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">Verify Your Account</h2>
                        <p style="color: #718096; margin: 0; font-size: 16px; line-height: 1.5;">Welcome to ParcelUp! Please use the verification code below to complete your registration.</p>
                    </div>
                    
                    <!-- Verification Code -->
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 3px dashed #667eea; padding: 30px; border-radius: 15px; display: inline-block; position: relative;">
                            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 15px; color: #667eea; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                            <div style="font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
                        </div>
                    </div>
                    
                    <!-- Timer Info -->
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-left: 4px solid #e53e3e; padding: 20px; border-radius: 10px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">⏰</span>
                            <div>
                                <p style="margin: 0; color: #c53030; font-weight: 600; font-size: 14px;">TIME SENSITIVE</p>
                                <p style="margin: 5px 0 0 0; color: #742a2a; font-size: 14px;">This code will expire in 10 minutes for security reasons.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-left: 4px solid #38a169; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">🔒</span>
                            <div>
                                <p style="margin: 0; color: #2f855a; font-weight: 600; font-size: 14px;">SECURITY NOTICE</p>
                                <p style="margin: 5px 0 0 0; color: #276749; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding: 20px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 10px 0;">This is an automated message, please do not reply to this email.</p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">© 2024 ParcelUp. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
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
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ParcelUp Email Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: white; display: inline-block; padding: 20px 40px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="margin: 0; color: #667eea; font-size: 32px; font-weight: 700; letter-spacing: 2px;">ParcelUp</h1>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px; font-weight: 500;">PACKAGE TRACKING MADE SIMPLE</p>
                </div>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
                <!-- Decorative Elements -->
                <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                
                <div style="position: relative; z-index: 1;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 50px; margin-bottom: 20px;">
                            <div style="background: white; padding: 15px 25px; border-radius: 50px;">
                                <span style="font-size: 24px;">📧</span>
                            </div>
                        </div>
                        <h2 style="color: #2d3748; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">Email Update Request</h2>
                        <p style="color: #718096; margin: 0; font-size: 16px; line-height: 1.5;">You have requested to update your email address. Please verify this change using the code below.</p>
                    </div>
                    
                    <!-- Verification Code -->
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 3px dashed #667eea; padding: 30px; border-radius: 15px; display: inline-block; position: relative;">
                            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 15px; color: #667eea; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                            <div style="font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
                        </div>
                    </div>
                    
                    <!-- Timer Info -->
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-left: 4px solid #e53e3e; padding: 20px; border-radius: 10px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">⏰</span>
                            <div>
                                <p style="margin: 0; color: #c53030; font-weight: 600; font-size: 14px;">TIME SENSITIVE</p>
                                <p style="margin: 5px 0 0 0; color: #742a2a; font-size: 14px;">This code will expire in 10 minutes for security reasons.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Warning -->
                    <div style="background: linear-gradient(135deg, #fffaf0 0%, #feebc8 100%); border-left: 4px solid #d69e2e; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">⚠️</span>
                            <div>
                                <p style="margin: 0; color: #b7791f; font-weight: 600; font-size: 14px;">SECURITY ALERT</p>
                                <p style="margin: 5px 0 0 0; color: #975a16; font-size: 14px;">If you didn't request this change, please secure your account immediately as someone else may be trying to access it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding: 20px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 10px 0;">This is an automated message, please do not reply to this email.</p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">© 2024 ParcelUp. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send a password reset email to a user
 * @param {Object} options - Options containing user email, name, and reset URL
 * @param {string} options.email - User's email address
 * @param {string} options.name - User's full name
 * @param {string} options.resetUrl - Password reset URL with token
 */
const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const subject = "Password Reset Request";
  const text = `Hello ${name},\n\nYou are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease click on the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ParcelUp Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: white; display: inline-block; padding: 20px 40px; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="margin: 0; color: #667eea; font-size: 32px; font-weight: 700; letter-spacing: 2px;">ParcelUp</h1>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px; font-weight: 500;">PACKAGE TRACKING MADE SIMPLE</p>
                </div>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
                <!-- Decorative Elements -->
                <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.1;"></div>
                
                <div style="position: relative; z-index: 1;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 50px; margin-bottom: 20px;">
                            <div style="background: white; padding: 15px 25px; border-radius: 50px;">
                                <span style="font-size: 24px;">🔐</span>
                            </div>
                        </div>
                        <h2 style="color: #2d3748; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">Password Reset Request</h2>
                        <p style="color: #718096; margin: 0; font-size: 16px; line-height: 1.5;">Hello ${name}, we received a request to reset your password for your ParcelUp account.</p>
                    </div>
                    
                    <!-- Reset Button -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                            🔓 Reset Password
                        </a>
                    </div>
                    
                    <!-- Alternative Link -->
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 15px; padding: 25px; margin: 30px 0;">
                        <p style="margin: 0 0 15px 0; color: #4a5568; font-weight: 600; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 2px dashed #cbd5e0; word-break: break-all;">
                            <a href="${resetUrl}" style="color: #667eea; text-decoration: none; font-size: 14px;">${resetUrl}</a>
                        </div>
                    </div>
                    
                    <!-- Timer Info -->
                    <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-left: 4px solid #e53e3e; padding: 20px; border-radius: 10px; margin: 30px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">⏰</span>
                            <div>
                                <p style="margin: 0; color: #c53030; font-weight: 600; font-size: 14px;">TIME SENSITIVE</p>
                                <p style="margin: 5px 0 0 0; color: #742a2a; font-size: 14px;">This link will expire in 10 minutes for security reasons.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-left: 4px solid #38a169; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">🔒</span>
                            <div>
                                <p style="margin: 0; color: #2f855a; font-weight: 600; font-size: 14px;">SECURITY NOTICE</p>
                                <p style="margin: 5px 0 0 0; color: #276749; font-size: 14px;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding: 20px;">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 10px 0;">This is an automated message, please do not reply to this email.</p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">© 2024 ParcelUp. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendEmailUpdateVerification,
  sendPasswordResetEmail,
  generateVerificationCode,
};
