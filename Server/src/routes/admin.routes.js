import express from 'express';
import { uploadDocument } from '../configs/cloudinary.js';
import Admin from '../models/admin.model.js';
import { getStudentsByYear } from '../controllers/admin.controller.js';
import {isAdmin} from "../middlewares/auth.middleware.js";

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


router.post('/upload-certificate', uploadDocument.single('document'), createCertificate);

router.post('/upload-certificate', authMiddleware, uploadDocument.single('certificate'), createCertificate);
router.post('/verify', authMiddleware, verifyCertificateController);

router.patch('/certificate/revoke', authMiddleware, revokeCertificateController);

router.get('/get_all_student',authMiddleware, Admin.getAllUsers);
router.get('/certificate', authMiddleware, getAllCertificate);
router.get('/certificate/:id', authMiddleware, getCertificateById);
router.get('/verify', authMiddleware, verifyCertificateController);
router.get('/record/verify', authMiddleware, getVerificationRecords);
router.get('/records/:hash', authMiddleware, getVerificationByHash);
router.get(
    '/students', authMiddleware, isAdmin,
    getStudentsByYear
);

export default router;