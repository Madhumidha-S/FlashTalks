/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and video data
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile details
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/me/videos:
 *   get:
 *     summary: Get all videos uploaded by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of user's videos
 *       401:
 *         description: Unauthorized
 */

import express from "express";
import { authRequired } from "../middleware/index.js";
import { getProfile } from "../controllers/index.js";
import { getMyTalks } from "../controllers/flashtalkController.js";

const router = express.Router();

router.get("/me", authRequired, getProfile);

router.get("/me/videos", authRequired, getMyTalks);

export default router;
