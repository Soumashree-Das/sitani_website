import nodemailer from 'nodemailer';
import CompanyInfo from '../models/companyInfo.model.js';

// Function to get email credentials from database
const getEmailCredentials = async () => {
  const companyInfo = await CompanyInfo.findOne()
    .select('contactInfo.email contactInfo.emailAppPassword')
    .sort({ createdAt: -1 })
    .lean();

  if (!companyInfo?.contactInfo?.email || !companyInfo?.contactInfo?.emailAppPassword) {
    throw new Error('Email credentials not configured in database');
  }

  return {
    email: companyInfo.contactInfo.email,
    password: companyInfo.contactInfo.emailAppPassword
  };
};

const sendFormData = async (formData) => {
  try {
    // Get credentials from database
    const { email: adminEmail, password } = await getEmailCredentials();

    // Create transporter with database credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: password
      }
    });

    const { 
      email: userEmail, 
      name, 
      subject, 
      message, 
      phone,
      ...otherFields 
    } = formData;

    // === 1. Send mail to company ===
    let emailContent = `
      <h2>New Form Submission</h2>
      <p><strong>From:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject || 'Form Submission'}</p>
      <p><strong>Message:</strong></p>
      <p>${message || 'No message provided'}</p>
    `;

    if (Object.keys(otherFields).length > 0) {
      emailContent += '<h3>Additional Information:</h3>';
      Object.entries(otherFields).forEach(([key, value]) => {
        emailContent += `<p><strong>${key}:</strong> ${value}</p>`;
      });
    }

    const mailOptionsToCompany = {
      from: adminEmail,
      to: 'dasshree2305@gmail.com',
      subject: subject || `New Form Submission from ${name || userEmail}`,
      html: emailContent,
      replyTo: userEmail
    };

    const companyInfo = await transporter.sendMail(mailOptionsToCompany);

    // === 2. Auto-reply to user ===
    const autoReplyOptions = {
      from: adminEmail,
      to: userEmail,
      subject: `Thank you for contacting us, ${name || 'there'}!`,
      html: `
        <p>Hi ${name || ''},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <blockquote>${message || 'No message provided'}</blockquote>
        <p>Regards,<br/>Team BuildCraft</p>
      `
    };

    const userInfo = await transporter.sendMail(autoReplyOptions);

    return {
      success: true,
      message: 'Form data sent successfully and auto-reply sent',
      messageId: companyInfo.messageId,
      autoReplyId: userInfo.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send form data',
      error: error.message
    };
  }
};


// Controller function for handling form submissions
export const handleFormSubmission = async (req, res) => {
  try {
    // Extract form data from request body
    const formData = req.body;
    
    // Validate required fields
    if (!formData.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send email
    const result = await sendFormData(formData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Error handling form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export { sendFormData };