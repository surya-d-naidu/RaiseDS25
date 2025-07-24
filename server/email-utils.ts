import nodemailer from "nodemailer";

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Base email template with consistent branding
 */
function createBaseEmailTemplate(title: string, content: string, footerText?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - RAISE DS 2025</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #334155;
          background-color: #f8fafc;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }
        
        .header .subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .content p {
          font-size: 16px;
          color: #475569;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        
        .otp-box {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 12px;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 14px 0 rgba(30, 64, 175, 0.3);
        }
        
        .warning-box {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          color: white;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 12px;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
        }
        
        .info-box {
          background: #f1f5f9;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .info-box p {
          margin: 0;
          color: #475569;
          font-size: 14px;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin: 20px 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(30, 64, 175, 0.3);
        }
        
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(30, 64, 175, 0.4);
        }
        
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
        }
        
        .footer .contact-info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer .contact-info p {
          margin-bottom: 5px;
        }
        
        .footer .social-links {
          margin-top: 15px;
        }
        
        .footer .social-links a {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 10px;
          font-weight: 500;
        }
        
        @media (max-width: 640px) {
          .container {
            margin: 0 10px;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .otp-box, .warning-box {
            font-size: 28px;
            letter-spacing: 8px;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px 0;">
        <div class="container">
          <div class="header">
            <h1>RAISE DS 2025</h1>
            <div class="subtitle">45th Annual Convention of Indian Society for Probability and Statistics</div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p>&copy; 2025 RAISE DS Conference. All rights reserved.</p>
            <p>${footerText || 'Thank you for being part of RAISE DS 2025!'}</p>
            
            <div class="contact-info">
              <p><strong>Conference Contact:</strong></p>
              <p>Email: raiseds25@vitap.ac.in</p>
              <p>Website: www.raiseds25.com</p>
              <p>Phone: +91-7673944853</p>
            </div>
            
            <div class="social-links">
              <a href="https://www.raiseds25.com">Conference Website</a>
              <a href="mailto:raiseds25@vitap.ac.in">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send an email to the specified recipient
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    
    await transporter.sendMail({
      from: `"RAISE DS 2025 Conference" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${subject} - RAISE DS 2025`,
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
  const subject = "Email Verification Required";
  
  const content = `
    <h2>Email Verification</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering for RAISE DS 2025. To complete your registration, please verify your email address using the OTP below:</p>
    
    <div class="otp-box">${otp}</div>
    
    <div class="info-box">
      <p><strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.</p>
    </div>
    
    <p>If you didn't create an account with us, please ignore this email and your information will be automatically removed from our system.</p>
  `;
  
  const html = createBaseEmailTemplate("Email Verification", content, "Secure your account by verifying your email address.");
  return sendEmail(email, subject, html);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, otp: string, name: string): Promise<boolean> {
  const subject = "Password Reset Request";
  
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>You have requested to reset your password for your RAISE DS 2025 account. Use the following OTP to proceed with resetting your password:</p>
    
    <div class="warning-box">${otp}</div>
    
    <div class="info-box">
      <p><strong>Security Notice:</strong> This OTP will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
    
    <p>For your security, never share this OTP with anyone. Our team will never ask for your OTP via phone or email.</p>
  `;
  
  const html = createBaseEmailTemplate("Password Reset", content, "Keep your account secure with a strong password.");
  return sendEmail(email, subject, html);
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = "Welcome to RAISE DS 2025";
  
  const content = `
    <h2>Welcome to RAISE DS 2025!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Congratulations! Your registration for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) has been completed successfully.</p>
    
    <div class="info-box">
      <p><strong>Conference Details:</strong><br>
      📅 December 22-24, 2025<br>
      📍 VIT-AP University, Vijayawada<br>
      🎯 Theme: Recent Advances and Innovative Statistics with Enhancing Data Science
      </p>
    </div>
    
    <p>You can now:</p>
    <ul style="margin: 20px 0; padding-left: 20px; color: #475569;">
      <li>Submit your research abstracts</li>
      <li>Register for the conference</li>
      <li>Access conference materials</li>
      <li>Connect with fellow researchers</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.raiseds25.com" class="button">Access Conference Portal</a>
    </div>
    
    <p>We look forward to your participation in this prestigious conference!</p>
  `;
  
  const html = createBaseEmailTemplate("Welcome", content, "Thank you for joining the RAISE DS 2025 community!");
  return sendEmail(email, subject, html);
}

/**
 * Send abstract submission confirmation email
 */
export async function sendAbstractConfirmationEmail(email: string, name: string, abstractTitle: string, abstractId: string): Promise<boolean> {
  const subject = "Abstract Submission Confirmation";
  
  const content = `
    <h2>Abstract Submission Confirmed</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your abstract has been successfully submitted to RAISE DS 2025. Here are the details:</p>
    
    <div class="info-box">
      <p><strong>Abstract Title:</strong> ${abstractTitle}<br>
      <strong>Submission ID:</strong> ${abstractId}<br>
      <strong>Submitted On:</strong> ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      })}
      </p>
    </div>
    
    <p>Your abstract is now under review by our scientific committee. You will receive a notification once the review process is complete.</p>
    
    <p><strong>What's Next?</strong></p>
    <ul style="margin: 20px 0; padding-left: 20px; color: #475569;">
      <li>You will receive review results within 2-3 weeks</li>
      <li>If accepted, you'll get presentation guidelines</li>
      <li>Complete your conference registration</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.raiseds25.com/profile" class="button">View Your Submissions</a>
    </div>
  `;
  
  const html = createBaseEmailTemplate("Abstract Submission", content, "Thank you for contributing to RAISE DS 2025!");
  return sendEmail(email, subject, html);
}

/**
 * Send conference registration confirmation email
 */
export async function sendRegistrationConfirmationEmail(email: string, name: string, registrationId: string, amount?: number): Promise<boolean> {
  const subject = "Conference Registration Confirmation";
  
  const content = `
    <h2>Registration Confirmed</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your registration for RAISE DS 2025 has been confirmed. We're excited to have you join us!</p>
    
    <div class="info-box">
      <p><strong>Registration ID:</strong> ${registrationId}<br>
      <strong>Conference:</strong> RAISE DS 2025<br>
      <strong>Dates:</strong> December 22-24, 2025<br>
      <strong>Venue:</strong> VIT-AP University, Vijayawada
      ${amount ? `<br><strong>Registration Fee:</strong> ₹${amount}` : ''}
      </p>
    </div>
    
    <p><strong>Important Information:</strong></p>
    <ul style="margin: 20px 0; padding-left: 20px; color: #475569;">
      <li>Keep this email as your registration confirmation</li>
      <li>Bring a valid ID for conference check-in</li>
      <li>Conference kit will be provided at the venue</li>
      <li>Lunch and refreshments are included</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.raiseds25.com/profile" class="button">Download Registration Certificate</a>
    </div>
    
    <p>For any queries, please contact us at raiseds25@vitap.ac.in</p>
  `;
  
  const html = createBaseEmailTemplate("Registration Confirmation", content, "See you at RAISE DS 2025!");
  return sendEmail(email, subject, html);
}

/**
 * Send invitation email for conference attendance
 */
export async function sendAttendanceInvitationEmail(email: string, name: string, message: string, attendanceUrl: string): Promise<boolean> {
  const subject = "Invitation to Attend RAISE DS 2025";
  
  const content = `
    <h2>You're Invited to RAISE DS 2025!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>You are cordially invited to attend the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in conjunction with the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS).</p>
    
    <div class="info-box">
      <p><strong>Conference Details:</strong><br>
      📅 December 22-24, 2025<br>
      📍 VIT-AP University, Vijayawada<br>
      🎯 Theme: Recent Advances and Innovative Statistics with Enhancing Data Science
      </p>
    </div>
    
    ${message ? `<p><strong>Personal Message:</strong></p><p style="font-style: italic; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>` : ''}
    
    <p>Please confirm your attendance by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${attendanceUrl}" class="button">Respond to Invitation</a>
    </div>
    
    <p>We look forward to your participation in this prestigious conference!</p>
  `;
  
  const html = createBaseEmailTemplate("Conference Invitation", content, "Join us for an exceptional academic experience!");
  return sendEmail(email, subject, html);
}

/**
 * Send account registration invitation email
 */
export async function sendAccountInvitationEmail(email: string, name: string, message: string, registerUrl: string): Promise<boolean> {
  const subject = "Invitation to Join RAISE DS 2025 Platform";
  
  const content = `
    <h2>Join the RAISE DS 2025 Community!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>You have been invited to join the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) conference platform.</p>
    
    <div class="info-box">
      <p><strong>Platform Benefits:</strong><br>
      🔬 Submit research abstracts<br>
      📋 Register for the conference<br>
      📚 Access conference materials<br>
      🤝 Connect with fellow researchers
      </p>
    </div>
    
    ${message ? `<p><strong>Personal Message:</strong></p><p style="font-style: italic; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>` : ''}
    
    <p>Click the button below to create your account and get started:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${registerUrl}" class="button">Create Account</a>
    </div>
    
    <p>Welcome to the RAISE DS 2025 community!</p>
  `;
  
  const html = createBaseEmailTemplate("Platform Invitation", content, "Start your journey with RAISE DS 2025!");
  return sendEmail(email, subject, html);
}
