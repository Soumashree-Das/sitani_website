import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates a configured multer instance for file uploads
 * @param {Object} options - Configuration options
 * @param {string} options.subfolder - Subfolder within uploads directory
 * @param {string} [options.filePrefix='file'] - Prefix for uploaded files
 * @param {number} [options.maxSize=10] - Max file size in MB
 * @param {string[]} [options.allowedTypes=['image/jpeg', 'image/png']] - Allowed MIME types
 * @returns {multer.Multer} Configured multer instance
 */

// const createUploader = ({ 
//   subfolder, 
//   filePrefix = 'file', 
//   maxSize = 10,
//   allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
// }) => {
//   // Configure storage
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(__dirname, '..', 'uploads', subfolder);
      
//       // Create directory if it doesn't exist
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       const ext = path.extname(file.originalname);
//       cb(null, `${filePrefix}-${uniqueSuffix}${ext}`);
//     }
//   });

//   // File filter
//   const fileFilter = (req, file, cb) => {
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`), false);
//     }
//   };

//   return multer({ 
//     storage,
//     fileFilter,
//     limits: {
//       fileSize: maxSize * 1024 * 1024 // Convert MB to bytes
//     }
//   });
// };

export const createUploader = ({
  subfolder,
  filePrefix = 'file',
  maxSize = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '..', 'uploads', subfolder);
      
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${filePrefix}-${uniqueSuffix}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize * 1024 * 1024 }
  });
};

// Pre-configured uploaders for different use cases
export const companyImageUpload = createUploader({
  subfolder: 'company-images',
  filePrefix: 'company',
  maxSize: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});
export const serviceImageUpload = createUploader({
  subfolder: 'service-images',
  filePrefix: 'services',
  maxSize: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});
export const achievementImageUpload = createUploader({
  subfolder: 'acheivement-images',
  filePrefix: 'acheivements',
  maxSize: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});

export const userAvatarUpload = createUploader({
  subfolder: 'user-avatars',
  filePrefix: 'avatar',
  maxSize: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});

export const documentUpload = createUploader({
  subfolder: 'documents',
  filePrefix: 'doc',
  maxSize: 20,
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
});

export const projectImageUpload = createUploader({
  subfolder: 'project-images',
  filePrefix: 'project-img',
  maxSize: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});

export const projectVideoUpload = createUploader({
  subfolder: 'project-videos',
  filePrefix: 'project-video',
  maxSize: 100, // 100 MB max
  allowedTypes: ['video/mp4', 'video/webm']
});


// Generic single file upload middleware
export const uploadFile = (options) => createUploader(options).single('file');

// Generic multiple files upload middleware
export const uploadFiles = (options) => createUploader(options).array('files', 5); // Max 5 files by default