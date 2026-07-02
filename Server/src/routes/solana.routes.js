import express from 'express';
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
import authMiddleware from '../middlewares/auth.middleware.js';


const routes = express.Router();

routes.post('/', createUniversity);
routes.get('/', fetchAllUniversity);
routes.post('/incidents', authMiddleware, createIncidentReport);
routes.get('/incidents', authMiddleware, getAllIncidents);
// routes.post('/upload-certificate', authMiddleware, uploadDocument.single('certificate'), createCertificate);
// routes.get('/certificate', authMiddleware, getAllCertificate);
// routes.get('/certificate/:id', authMiddleware, getCertificateById);
// routes.post('/verify', authMiddleware, verifyCertificateController);
// routes.patch('/certificate/revoke', authMiddleware, revokeCertificateController);
routes.get('/verify', authMiddleware, verifyCertificateController);
routes.get('/record/verify', authMiddleware, getVerificationRecords);
routes.get('/records/:hash', authMiddleware, getVerificationByHash);


export default routes;