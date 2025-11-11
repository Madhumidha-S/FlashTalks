import express from "express";
import { authRequired } from "../middleware/index.js";
import { getProfile } from "../controllers/index.js";
import { getMyTalks } from "../controllers/flashtalkController.js"; // ✅ Import this!

const router = express.Router();

// Get logged-in user info
router.get("/me", authRequired, getProfile);

// Get videos uploaded by the logged-in user
router.get("/me/videos", authRequired, getMyTalks); // ✅ Now defined

export default router;
