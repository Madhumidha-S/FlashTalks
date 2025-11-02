import express from "express";
import { googleAuth } from "../controllers/index.js";
const router = express.Router();

router.post("/google", googleAuth);
export default router;
