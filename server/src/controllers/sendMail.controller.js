import sgMail from '@sendgrid/api-key'; // Using SendGrid as example
import CompanyInfo from '../models/CompanyInfo.js'; // Adjust path as needed

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send contact form email to company
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message, phone, company } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, email, subject, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Get the latest company email from database
    const companyInfo = await CompanyInfo.findOne()
      .select('contactInfo.email')
      .sort({ updatedAt: -1 });
    
    if (!companyInfo || !companyInfo.contactInfo.email) {
      return res.status(500).json({
        success: false,
        message: 'Company contact information is not available. Please try again later.'
      });
    }

    const companyEmail = companyInfo.contactInfo.email;

    // Email content
    const emailContent = {
      to: companyEmail, // Company email from database
      from: process.env.SENDGRID_FROM_EMAIL, // Your verified sender email
      replyTo: email, // Customer's email for replies
      subject: `Website Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
          <div style="background-color: #d97706; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #374151; margin-bottom: 20px;">Contact Details:</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706;">
              <p style="line-height: 1.6; color: #4b5563; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 6px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Note:</strong> Reply to this email to respond directly to the customer.
              </p>
            </div>
          </div>
          
          <div style="background-color: #374151; padding: 20px; text-align: center;">
            <p style="color: #d1d5db; margin: 0; font-size: 12px;">
              Sent from your website contact form on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Send email using SendGrid
    await sgMail.send(emailContent);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};
// //  Alternative using Mailgun

// import formData from 'form-data';
// import Mailgun from 'mailgun.js';

// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: 'api',
//   key: process.env.MAILGUN_API_KEY
// });

// export const sendContactEmailMailgun = async (req, res) => {
//   try {
//     const { name, email, subject, message, phone, company } = req.body;

//     if (!name || !email || !subject || !message) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please fill in all required fields'
//       });
//     }

//     const companyInfo = await CompanyInfo.findOne()
//       .select('contactInfo.email')
//       .sort({ updatedAt: -1 });
    
//     if (!companyInfo || !companyInfo.contactInfo.email) {
//       return res.status(500).json({
//         success: false,
//         message: 'Company contact information not available'
//       });
//     }

//     await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from: `Contact Form <noreply@${process.env.MAILGUN_DOMAIN}>`,
//       to: [companyInfo.contactInfo.email],
//       'h:Reply-To': email,
//       subject: `Website Contact: ${subject}`,
//       html: `Contact form submission from ${name} (${email}): ${message}`
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Message sent successfully!'
//     });

//   } catch (error) {
//     console.error('Mailgun error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to send message'
//     });
//   }
// };
