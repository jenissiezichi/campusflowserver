import express from 'express';
import { uploadDocument } from '../configs/cloudinary.js';
import Admin from '../models/admin.model.js';
import {isAdmin} from "../middlewares/auth.middleware.js";
import {getAllStudents, getCertificateByMatric, getStudentsByLevel, getAllClearanceUpload} from '../controllers/admin.controller.js';
import {
  getAllIncidents,
  createUniversity,
  fetchAllUniversity,
  createIncidentReport,
  createCertificate,
  getAllCertificate,
  getCertificateById,
  revokeCertificateController,
  getVerificationRecords,
} from '../controllers/solana.controllers.js'

import authMiddleware from '../middlewares/auth.middleware.js'


const router = express.Router();



router.post('/upload-certificate', authMiddleware, uploadDocument.single('certificate'), createCertificate);
router.get('/incidents', authMiddleware,getAllIncidents);
router.get('/certificate/student/:matric_number', isAdmin, getCertificateByMatric);
router.patch('/certificate/revoke',isAdmin, authMiddleware, revokeCertificateController);
router.get('/students', isAdmin, getStudentsByLevel);
router.get('/get_all_users',isAdmin, getAllStudents);
router.get('/certificate', authMiddleware, getAllCertificate); // all certificates
router.get('/certificate/:id', authMiddleware, getCertificateById);
router.get('/record/verify', authMiddleware, getVerificationRecords);
router.get('/clearance-upload', authMiddleware, getAllClearanceUpload);

export default router;