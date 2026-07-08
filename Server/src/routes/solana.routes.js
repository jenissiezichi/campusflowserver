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
  getVerificationRecords,
  getVerificationByHash
} from '../controllers/solana.controllers.js'
import authMiddleware from '../middlewares/auth.middleware.js';
import {verifyCertificateController} from "../controllers/public.controller.js";



const routes = express.Router();
routes.post('/verify', verifyCertificateController)
routes.post('/', createUniversity);
// routes.get('/', fetchAllUniversity);
// routes.post('/incidents', authMiddleware, createIncidentReport);
// routes.get('/incidents', authMiddleware, getAllIncidents);

export default routes;