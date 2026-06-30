import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderPath = 'campus-flow/student-documents';
    if (req.baseUrl.includes('admin') || req.body.uploadType === 'certificate') {
      folderPath = 'campus-flow/certificates';
    }
    return {
      folder: folderPath,
      resource_type: 'auto',
      format: file.mimetype.split('/')[1] === 'pdf' ? 'pdf' : undefined,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false);
  }
};

export const uploadDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }

})