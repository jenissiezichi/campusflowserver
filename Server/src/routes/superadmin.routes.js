import { Router } from "express";
import { getAllAdmins, getAllCertificates, getSystemHealth ,getAllStaffs, getAllStudents, getAllDocuments  } from "../controllers/superadmin.controllers.js";
import { fetchAllUniversity } from "../controllers/solana.controllers.js";
import { isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/getallstudents', isSuperAdmin, getAllStudents);
router.get('/getallstaffs', isSuperAdmin, getAllStaffs);
router.get('/getalladmins', isSuperAdmin, getAllAdmins);
router.get('/getallcertificates', isSuperAdmin, getAllCertificates);
router.get('/universities', isSuperAdmin, fetchAllUniversity);
router.get('/documents', isSuperAdmin, getAllDocuments);
router.get('/health',isSuperAdmin,getSystemHealth);

export default router;