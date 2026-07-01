import { Router } from "express";
import { uploadDocument } from "../configs/cloudinary.js";
import { uploadStudentDocument } from "../controllers/student.controller.js";
import { getClearanceStages } from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/rateLimiter.middleware.js";
const router = Router();

router.post('/upload-document', uploadDocument.single('document'), uploadStudentDocument);

router.get('/clearance-stages', authMiddleware, getClearanceStages);
export default router;