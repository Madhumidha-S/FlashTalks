import express from "express";
import { curatorOnly, authRequired } from "../middleware/index.js";
import {
  createTalk,
  getPublishedTalks,
  getMyTalks,
  updateTalkStatus,
} from "../controllers/index.js";
import pool from "../utils/database.js";

const router = express.Router();

router.post("/", authRequired, createTalk);
router.get("/published", getPublishedTalks);
router.get("/mine", authRequired, getMyTalks);
router.patch("/:id/status", authRequired, curatorOnly, updateTalkStatus);

router.get("/:id", authRequired, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;

  try {
    const result = await pool.query(
      `
      SELECT 
        f.*,
        u.name AS owner_name,
        u.avatar AS owner_avatar,
        COALESCE(lc.like_count, 0) AS like_count,
        COALESCE(sc.save_count, 0) AS save_count,
        CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_me,
        CASE WHEN us.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS saved_by_me
      FROM flashtalks f
      JOIN users u ON u.id = f.owner_id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS like_count FROM likes GROUP BY flashtalk_id
      ) lc ON lc.flashtalk_id = f.id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS save_count FROM saved GROUP BY flashtalk_id
      ) sc ON sc.flashtalk_id = f.id
      LEFT JOIN likes ul ON ul.flashtalk_id = f.id AND ul.user_id = $2
      LEFT JOIN saved us ON us.flashtalk_id = f.id AND us.user_id = $2
      WHERE f.id = $1 AND f.status = 'published'
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching talk by ID:", err.message);
    res.status(500).json({ error: "Failed to load video" });
  }
});

export default router;
