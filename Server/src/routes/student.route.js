import { Router } from "express";
import { uploadDocument } from "../configs/cloudinary.js";
import { uploadStudentDocument } from "../controllers/student.controller.js";

const router = Router();

router.post('/upload-document', uploadDocument.single('document'), uploadStudentDocument);

export default router;