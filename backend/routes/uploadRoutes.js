import express from "express";
import {
  getUploadUrl,
  saveVideo,
  getPlayUrl,
} from "../controllers/uploadController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();
router.get("/upload-url", getUploadUrl);
router.get("/play-url", getPlayUrl);
router.post("/save", saveVideo);
export default router;
