/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like-related operations
 */

/**
 * @swagger
 * /api/likes/toggle:
 *   post:
 *     summary: Like or unlike a video
 *     security:
 *       - bearerAuth: []
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flashtalk_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Like status updated
 */

/**
 * @swagger
 * /api/likes/my:
 *   get:
 *     summary: Get all videos liked by the user
 *     security:
 *       - bearerAuth: []
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: Liked videos list
 */

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
