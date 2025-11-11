import express from "express";
import { authRequired } from "../middleware/index.js";
import {
  toggleLike,
  getLikesCount,
  getLikedTalks,
} from "../controllers/index.js";

const router = express.Router();

router.post("/toggle", authRequired, toggleLike);
router.get("/:id/count", getLikesCount);
router.get("/my", authRequired, getLikedTalks);

export default router;
