import nodemailer from "nodemailer";

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send an email to the specified recipient
 * @param to Email address of the recipient
 * @param subject Email subject
 * @param html HTML content of the email
 * @returns Promise that resolves to true if email was sent, false otherwise
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    // Log email for development purposes
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    
    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER || '"RAISE DS 2025" <noreply@raiseds25.com>',
      to,
      subject,
      html,
    });
    
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send OTP verification email
 */
export async function sendOTPEmail(email: string, otp: string, name: string): Promise<boolean> {
  const subject = "Verify Your Email - RAISE DS 2025";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0;">RAISE DS 2025</h1>
        <p style="color: #6b7280; margin: 5px 0;">45th Annual Convention of ISPS</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 30px; text-align: center;">
        <h2 style="color: #374151; margin-bottom: 20px;">Email Verification</h2>
        <p style="color: #6b7280; margin-bottom: 30px;">
          Hello ${name},<br><br>
          Thank you for registering for RAISE DS 2025. Please use the following OTP to verify your email address:
        </p>
        
        <div style="background: #1e40af; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 30px 0;">
          ${otp}
        </div>
        
        <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
          This OTP will expire in 10 minutes.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>&copy; 2025 RAISE DS Conference. All rights reserved.</p>
      </div>
    </div>
  `;
  
  return sendEmail(email, subject, html);
}
