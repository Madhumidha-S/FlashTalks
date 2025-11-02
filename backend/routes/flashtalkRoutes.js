import express from "express";
import { curatorOnly, authRequired } from "../middleware/index.js";
import {
  createTalk,
  getPublishedTalks,
  getMyTalks,
  updateTalkStatus,
} from "../controllers/index.js";

const router = express.Router();

router.post("/", authRequired, createTalk);
router.get("/published", getPublishedTalks);
router.get("/mine", authRequired, getMyTalks);
router.patch("/:id/status", authRequired, curatorOnly, updateTalkStatus);

export default router;
