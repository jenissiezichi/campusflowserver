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

// routes.post('/', createUniversity);
// routes.get('/', fetchAllUniversity);
// routes.post('/incidents', authMiddleware, createIncidentReport);
// routes.get('/incidents', authMiddleware, getAllIncidents);

export default routes;