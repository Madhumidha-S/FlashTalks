import express from "express";
import { authRequired } from "../middleware/index.js";
import { toggleSave, getSavedTalks } from "../controllers/index.js";
import { auth } from "google-auth-library";

const router = express.Router();

router.post("/toggle", authRequired, toggleSave);
router.get("/my", authRequired, getSavedTalks);

export default router;
