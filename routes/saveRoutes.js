/**
 * @swagger
 * tags:
 *   name: Saved
 *   description: Saved video management
 */

/**
 * @swagger
 * /api/saved/toggle:
 *   post:
 *     summary: Save or unsave a video
 *     security:
 *       - bearerAuth: []
 *     tags: [Saved]
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
 *         description: Save status updated
 */

/**
 * @swagger
 * /api/saved/my:
 *   get:
 *     summary: Get all videos saved by the user
 *     security:
 *       - bearerAuth: []
 *     tags: [Saved]
 *     responses:
 *       200:
 *         description: Saved videos list
 */

import express from "express";
import { authRequired } from "../middleware/index.js";
import { toggleSave, getSavedTalks } from "../controllers/index.js";
import { auth } from "google-auth-library";

const router = express.Router();

router.post("/toggle", authRequired, toggleSave);
router.get("/my", authRequired, getSavedTalks);

export default router;
