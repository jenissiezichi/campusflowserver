import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { verifyCertificateController } from "../controllers/solana.controllers.js";

const router = Router();

router.post('/verify', verifyCertificateController);

export default router;
