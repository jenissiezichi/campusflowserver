import express from 'express';
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
const routes = express.Router();
routes.post('/', createUniversity);
routes.get('/',  fetchAllUniversity);
routes.post('/incidents',authMiddleware, createIncidentReport);
    routes.get('/incidents',authMiddleware, getAllIncidents);
    routes.post('/certificate',authMiddleware,createCertificate);
routes.get('/certificate',authMiddleware,getAllCertificate);
routes.get('/certificate/:id',authMiddleware,getCertificateById);
routes.post('/verify', authMiddleware,verifyCertificateController);
routes.patch('/certificate/revoke',authMiddleware,revokeCertificateController);
routes.get('/verify',authMiddleware, verifyCertificateController);
routes.get('/record/verify',authMiddleware, getVerificationRecords);
routes.get('/records/:hash', authMiddleware,getVerificationByHash);


export default routes;