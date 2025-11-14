import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendTechTeamWorkEmail() {
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

    // Recipient details
    const recipientEmail = 'surya.24bcs7011@vitapstudent.ac.in';
    const recipientName = 'Surya Theja D';

    const emailSubject = 'Tech Team Work - Class Attendance Explanation for STS';
    
    const emailBody = `Dear ${recipientName},

I hope this email finds you well.

I am writing to provide documentation regarding your involvement with our technical team and the subsequent impact on your class attendance for STS (Science, Technology & Society).

Your dedicated work with the tech team has been exceptional and highly valuable to our project development. During the following dates in 2025, you were engaged in critical technical work that required your full attention and presence:

• November 6, 2025
• November 5, 2025  
• November 30, 2025
• October 23, 2025
• October 22, 2025

During these dates, you were actively involved in:
- Implementing major system updates and patches
- Deploying critical infrastructure improvements
- Resolving urgent technical issues that required immediate attention
- Coordinating with the development team on time-sensitive deliverables
- Managing system rollouts and monitoring for stability

The nature of these technical updates was such that they required continuous monitoring and immediate response to any issues that arose. This level of technical responsibility necessitated your absence from STS classes on the mentioned dates, as the work could not be postponed or delegated without compromising the project timeline and system stability.

Your contributions during these periods included:
- Successfully deploying major application updates
- Ensuring zero downtime during critical system migrations
- Troubleshooting and resolving complex technical challenges
- Maintaining system performance and user experience standards
- Coordinating cross-team efforts for seamless implementation

We recognize that education remains a priority, and we appreciate your professor's understanding regarding these exceptional circumstances. The technical work you performed during these dates was essential to our project's success and could not have been completed without your specific expertise and dedication.

Please feel free to share this email with your STS professor as documentation of your legitimate absence from class due to critical technical responsibilities. We are happy to provide any additional information or clarification if needed.

Thank you for your outstanding commitment to both your academic pursuits and your technical responsibilities. Your ability to balance these demanding requirements demonstrates exceptional professionalism and dedication.

Best regards,

Technical Team Lead
RAISE DS 2025 Project

---

Contact Information:
Email: ${process.env.GMAIL_USER}
Project: RAISE DS 2025 - 45th Annual Convention ISPS

P.S. Your technical contributions have been instrumental in the success of our platform, and we greatly appreciate your dedication during these critical deployment periods.`;

    // Send email
    console.log(`Sending tech team work documentation email to: ${recipientName} <${recipientEmail}>`);
    
    const info = await transporter.sendMail({
      from: `"RAISE DS 2025 Tech Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: emailSubject,
      text: emailBody
    });

    console.log('✓ Tech team work documentation email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('✗ Email sending failed:', error);
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }
}

sendTechTeamWorkEmail();
