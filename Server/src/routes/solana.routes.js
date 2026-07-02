import express from 'express';
<<<<<<< HEAD
import {getAllIncidents} from '../controllers/solana.controllers.js'
import {createUniversity} from '../controllers/solana.controllers.js'
import {fetchAllUniversity} from '../controllers/solana.controllers.js'
import {createIncidentReport} from '../controllers/solana.controllers.js'
import authMiddleware from '../middlewares/rateLimiter.middleware.js'
import {createCertificate} from '../controllers/solana.controllers.js'
import {getAllCertificate} from '../controllers/solana.controllers.js'
import {getCertificateById} from '../controllers/solana.controllers.js'
import {revokeCertificateController} from '../controllers/solana.controllers.js'
import {verifyCertificateController} from '../controllers/solana.controllers.js'
import {getVerificationRecords} from '../controllers/solana.controllers.js'
import {getVerificationByHash} from '../controllers/solana.controllers.js'

=======
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
>>>>>>> b7be8d8097d30861ee424613f305001b92c9c05f


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