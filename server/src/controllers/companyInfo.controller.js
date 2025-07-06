import path from "path";
import { companyImageUpload } from '../middlewares/fileUpload.middleware.js';
import CompanyInfo from '../models/companyInfo.model.js';

// Middleware to process company image upload
export const processCompanyForm = companyImageUpload.single('image');

// Unified Update Function for both AboutUs and ContactInfo
// export const updateCompanyInfo = async (req, res) => {
//   try {
//     const { body, file } = req;

//     // Initialize update object
//     const updateData = { lastUpdated: new Date() };

//     // Process AboutUs data if present in request
//     if (body.mission || body.vision || body.title || file) {
//       updateData.aboutUs = {
//         mission: body.mission,
//         vision: body.vision,
//         title: body.title,
//         location: {
//           address: body.address,
//           city: body.city,
//           country: body.country,
//           timezone: body.timezone
//         },
//         lastUpdated: new Date()
//       };

//       if (file) {
//         updateData.aboutUs.imageUrl = `/uploads/company-images/${file.filename}`;
//         // updateData.aboutUs.imageUrl = path.join(process.cwd(),`/uploads/company-images/${file.filename}`);
//       }
//     }

//     // Process ContactInfo data if present in request
//     if (body.email || body.phoneNumbers) {
//       updateData.contactInfo = {
//         email: body.email,
//         emailAppPassword:body.emailAppPassword,
//         phoneNumbers: body.phoneNumbers ?
//           (Array.isArray(body.phoneNumbers) ? body.phoneNumbers : [body.phoneNumbers]) :
//           [],
//         availableHours: {
//           weekdays: {
//             from: body.weekdayFrom || '09:00',
//             to: body.weekdayTo || '17:00'
//           },
//           weekends: {
//             from: body.weekendFrom,
//             to: body.weekendTo
//           },
        
//         },
//         lastUpdated: new Date()
//       };
//     }

//     // Update document
//     const companyInfo = await CompanyInfo.findOneAndUpdate(
//       {},
//       { $set: updateData },
//       {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true,
//         runValidators: true
//       }
//     );

//     // Return both sections if updated, or just the updated ones
//     const responseData = {};
//     if (updateData.aboutUs) responseData.aboutUs = companyInfo.aboutUs;
//     if (updateData.contactInfo) responseData.contactInfo = companyInfo.contactInfo;

//     res.json({ success: true, data: responseData });
//   } catch (error) {
//     handleCompanyError(res, error);
//   }
// };

export const updateCompanyInfo = async (req, res) => {
  try {
    const { body, file } = req;

    /* 1️⃣  get current doc so we can keep the old image */
    const existing = await CompanyInfo.findOne();

    const updateData = { lastUpdated: new Date() };

    /* ───── About Us ───── */
    if (body.mission || body.vision || body.title || file) {
      updateData.aboutUs = {
        mission:     body.mission,
        vision:      body.vision,
        title:       body.title,
        location: {
          address:  body.address,
          city:     body.city,
          country:  body.country,
          timezone: body.timezone,
        },
        lastUpdated: new Date(),
      };

      if (file) {
        // new image chosen → overwrite
        updateData.aboutUs.imageUrl = `/uploads/company-images/${file.filename}`;
      } else if (existing?.aboutUs?.imageUrl) {
        // no new file → keep the old path
        updateData.aboutUs.imageUrl = existing.aboutUs.imageUrl;
      }
    }

    /* ───── Contact Info ───── */
    if (body.email || body.phoneNumbers) {
      updateData.contactInfo = {
        email:            body.email,
        emailAppPassword: body.emailAppPassword,
        phoneNumbers:     Array.isArray(body.phoneNumbers)
          ? body.phoneNumbers
          : body.phoneNumbers
          ? [body.phoneNumbers]
          : [],
        availableHours: {
          weekdays: {
            from: body.weekdayFrom || "09:00",
            to:   body.weekdayTo   || "17:00",
          },
          weekends: {
            from: body.weekendFrom,
            to:   body.weekendTo,
          },
        },
        lastUpdated: new Date(),
      };
    }

    /* ───── persist ───── */
    const companyInfo = await CompanyInfo.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        ...(updateData.aboutUs   ? { aboutUs:   companyInfo.aboutUs }   : {}),
        ...(updateData.contactInfo ? { contactInfo: companyInfo.contactInfo } : {}),
      },
    });
  } catch (error) {
    handleCompanyError(res, error);
  }
};


// Get About Us Info (separate)
export const getAboutUs = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findOne() || new CompanyInfo({});
    res.json({ success: true, data: companyInfo.aboutUs });
  } catch (error) {
    handleCompanyError(res, error);
  }
};

// Get Contact Info (separate)
export const getContactInfo = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findOne() || new CompanyInfo({});
    res.json({ success: true, data: companyInfo.contactInfo });
  } catch (error) {
    handleCompanyError(res, error);
  }
};

// Error handling helper
const handleCompanyError = (res, error) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors
    });
  }
  res.status(500).json({ success: false, message: error.message });
};

import fs from "fs";
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get content type based on file extension
function getContentType(ext) {
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  
  return mimeTypes[ext];
}

// Controller function for getting images
export const getImage = (req, res) => {
  try {
    const { filename } = req.params;
    
    // Construct the full file path
    // Adjust the path based on your project structure
    // If controller is in src/controllers, go up to src, then to uploads
    const filePath = path.join(__dirname, '..', 'uploads', 'company-images', filename);
    
    console.log('Looking for file at:', filePath); // Debug log
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Get file extension to set proper content type
    const ext = path.extname(filename).toLowerCase();
    const contentType = getContentType(ext);
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type'
      });
    }
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Send the file
    res.sendFile(path.resolve(filePath)); // Use path.resolve for absolute path
    
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

import { CompanyHistory } from "../models/companyInfo.model.js";

export const getCompanyHistory = async (req, res) => {
  try {
    const history = await CompanyHistory.find().sort({ year: 1 });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};