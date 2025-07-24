// Test email functionality
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✓ Gmail SMTP connection successful');

    // Send test email
    const testOTP = '123456';
    
    // Test email to self
    console.log('Sending test email to self...');
    const infoSelf = await transporter.sendMail({
      from: `"RAISE DS 2025" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Test OTP - RAISE DS 2025 (Self)',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Test OTP Email</h2>
          <div style="background: #1e40af; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 30px 0;">
            ${testOTP}
          </div>
          <p>This is a test email from RAISE DS 2025 registration system.</p>
        </div>
      `
    });

    console.log('✓ Self test email sent successfully');
    console.log('Self Message ID:', infoSelf.messageId);
    
    // Test email to external address
    console.log('Sending test email to external address...');
    const externalEmail = 'test@example.com'; // Replace with a test external email
    const infoExternal = await transporter.sendMail({
      from: `"RAISE DS 2025" <${process.env.GMAIL_USER}>`,
      to: externalEmail,
      subject: 'Test OTP - RAISE DS 2025 (External)',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>External Test OTP Email</h2>
          <div style="background: #1e40af; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 30px 0;">
            ${testOTP}
          </div>
          <p>This is a test email from RAISE DS 2025 registration system sent to an external address.</p>
        </div>
      `
    });
    
    console.log('✓ External test email sent successfully');
    console.log('External Message ID:', infoExternal.messageId);
  } catch (error) {
    console.error('✗ Email test failed:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }
}

testEmail();
