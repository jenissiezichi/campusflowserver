import { Router } from "express";
import { verifyCertificateController } from "../controllers/public.controller.js";

const router = Router();

router.post('/verify', verifyCertificateController);

export default router;
