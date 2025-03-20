const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const templates = {
  welcome: (user) => ({
    subject: 'Welcome to JobSeek!',
    html: `
      <h1>Welcome to JobSeek, ${user.firstName}!</h1>
      <p>Thank you for joining our platform. We're excited to help you in your career journey.</p>
      <p>Get started by:</p>
      <ul>
        <li>Completing your profile</li>
        <li>Uploading your resume</li>
        <li>Browsing available jobs</li>
      </ul>
      <p>Best regards,<br>The JobSeek Team</p>
    `
  }),

  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `
  }),

  applicationSubmitted: (application) => ({
    subject: 'Application Submitted Successfully',
    html: `
      <h1>Application Submitted</h1>
      <p>Your application for ${application.job.title} at ${application.job.company} has been submitted successfully.</p>
      <p>You can track your application status in your dashboard.</p>
      <p><a href="${process.env.FRONTEND_URL}/applications/${application._id}">View Application</a></p>
    `
  }),

  applicationUpdate: (application) => ({
    subject: `Application Status Update: ${application.status}`,
    html: `
      <h1>Application Status Update</h1>
      <p>Your application for ${application.job.title} has been ${application.status}.</p>
      ${application.interview ? `
        <h2>Interview Details:</h2>
        <p>Date: ${new Date(application.interview.scheduledAt).toLocaleString()}</p>
        <p>Type: ${application.interview.type}</p>
        <p>Location: ${application.interview.location}</p>
        <p>Notes: ${application.interview.notes}</p>
      ` : ''}
      <p><a href="${process.env.FRONTEND_URL}/applications/${application._id}">View Details</a></p>
    `
  }),

  newApplication: (application) => ({
    subject: 'New Job Application Received',
    html: `
      <h1>New Application Received</h1>
      <p>${application.applicant.firstName} ${application.applicant.lastName} has applied for ${application.job.title}.</p>
      <p><a href="${process.env.FRONTEND_URL}/employer/applications/${application._id}">Review Application</a></p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = templates[template](data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@jobseek.com',
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail
};
