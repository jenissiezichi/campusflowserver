import express from 'express';
import { uploadDocument } from '../configs/cloudinary.js';
import { getAllClearanceUpload, getAllStudents, getCertificateByMatric, getStudentsByLevel } from '../controllers/admin.controller.js';
import {
  createCertificate,
  getAllCertificate,
  getCertificateById,
  getVerificationByHash,
  getVerificationRecords,
  revokeCertificateController,
  verifyCertificateController
} from '../controllers/solana.controllers.js';
import { isAdmin } from "../middlewares/auth.middleware.js";

import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();



router.post('/upload-certificate', authMiddleware, uploadDocument.single('certificate'), createCertificate);

router.get('/certificate/student/:matric_number', isAdmin, getCertificateByMatric);
router.patch('/certificate/revoke', isAdmin, authMiddleware, revokeCertificateController);
router.get('/students', isAdmin, getStudentsByLevel);
router.get('/get_all_users', isAdmin, getAllStudents);

router.get('/certificate', authMiddleware, getAllCertificate);
router.get('/certificate/:id', authMiddleware, getCertificateById);
router.get('/record/verify', authMiddleware, getVerificationRecords);
router.get('/records/:hash', authMiddleware, getVerificationByHash);
router.get('/clearance-upload', authMiddleware, getAllClearanceUpload);

export default router;
