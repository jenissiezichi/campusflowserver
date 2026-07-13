import { Router } from "express";
import { getAllAdmins, getAllCertificates, getAllStaffs, getAllStudents,  } from "../controllers/superadmin.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/getallstudents', authMiddleware, getAllStudents);
router.get('/getallstaffs', authMiddleware, getAllStaffs);
router.get('/getalladmins', authMiddleware, getAllAdmins);
router.get('/getallcertificates', authMiddleware, getAllCertificates);


export default router;
