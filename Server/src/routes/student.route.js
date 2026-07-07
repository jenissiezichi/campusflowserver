import { Router } from "express";
import { uploadDocument } from "../configs/cloudinary.js";
import { uploadStudentDocument } from "../controllers/student.controller.js";
import { getClearanceStages, getClearanceStatus } from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {getVerificationByHash} from "../controllers/solana.controllers.js";
const router = Router();

router.post('/upload-document',authMiddleware, uploadDocument.single('document'), uploadStudentDocument);

router.get('/clearance-stages', authMiddleware, getClearanceStages);
router.get('/clearance-stats', authMiddleware, getClearanceStatus);
router.get('/certficate',authMiddleware,)
router.get('/verify-record/:hash', getVerificationByHash);
export default router;