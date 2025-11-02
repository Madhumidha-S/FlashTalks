import express from "express";
import { authRequired } from "../middleware/index.js";
import { toggleLike, getLikesCount } from "../controllers/index.js";

const router = express.Router();

router.post("/toggle", authRequired, toggleLike);
router.get("/:id/count", getLikesCount);

export default router;
