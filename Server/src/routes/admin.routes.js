import express from 'express';
import { uploadDocument } from '../configs/cloudinary.js';
import Admin from '../models/admin.model.js';
import {
  getAllIncidents,
  createUniversity,
  fetchAllUniversity,
  createIncidentReport,
  createCertificate,
  getAllCertificate,
  getCertificateById,
  revokeCertificateController,
  verifyCertificateController,
  getVerificationRecords,
  getVerificationByHash
} from '../controllers/solana.controllers.js'

import authMiddleware from '../middlewares/auth.middleware.js'


const router = express.Router();

router.get('/get_all_users', Admin.getAllUsers);

router.post('/upload-certificate', authMiddleware, uploadDocument.single('certificate'), createCertificate);
router.get('/certificate', authMiddleware, getAllCertificate);
router.get('/certificate/:id', authMiddleware, getCertificateById);
router.post('/verify', authMiddleware, verifyCertificateController);
router.patch('/certificate/revoke', authMiddleware, revokeCertificateController);
router.get('/verify', authMiddleware, verifyCertificateController);

export default router;