import express from "express";
import { authRequired } from "../middleware/index.js";
import { getProfile } from "../controllers/index.js";

const router = express.Router();
router.get("/me", authRequired, getProfile);

export default router;
