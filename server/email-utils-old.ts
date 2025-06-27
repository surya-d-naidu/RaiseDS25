import nodemailer from "nodemailer";

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
    console.log(`Body: ${html}`);
    
    // If SMTP settings are available, send the email
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"RAISE DS 2025" <noreply@raiseds25.com>',
        to,
        subject,
        html,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
