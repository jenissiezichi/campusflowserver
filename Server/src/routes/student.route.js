import { Router } from "express";
import { uploadDocument } from "../configs/cloudinary.js";
import { uploadStudentDocument } from "../controllers/student.controller.js";
import { getClearanceStages, getClearanceStatus,getMyNotifications, markNotificationRead, markAllNotificationsRead  } from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {getCertificateById} from "../controllers/solana.controllers.js"

const router = Router();

router.post('/upload-document',authMiddleware, uploadDocument.single('document'), uploadStudentDocument);

router.get('/clearance-stages', authMiddleware, getClearanceStages);
router.get('/clearance-stats', authMiddleware, getClearanceStatus);
router.get('/certificate', authMiddleware, getCertificateById);
router.get('/notifications', authMiddleware, getMyNotifications);
router.patch('/notifications/:id/read', authMiddleware, markNotificationRead);
router.patch('/notifications/read-all', authMiddleware, markAllNotificationsRead);

export default router;