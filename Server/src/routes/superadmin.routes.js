import { Router } from "express";
import { getAllAdmins, getAllStaffs, getAllStudents,  } from "../controllers/superadmin.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/getallstudents', authMiddleware, getAllStudents);
router.get('/getallstaffs', authMiddleware, getAllStaffs);
router.get('/getalladmins', authMiddleware, getAllAdmins);


export default router;
