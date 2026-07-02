import express from 'express';
import { uploadDocument } from '../configs/cloudinary.js';
import { createCertificate } from '../controllers/admin.controller.js';
import Admin from '../models/admin.model.js';

const router = express.Router();

router.post('/upload-certificate', uploadDocument.single('document'), createCertificate);
// router.get('/get_all_users', Admin.getAllUsers);

export default router;