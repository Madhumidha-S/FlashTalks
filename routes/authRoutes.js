/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate user using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenID:
 *                 type: string
 *                 description: Google ID token from client
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Invalid or missing token
 */

import express from "express";
import { googleAuth } from "../controllers/index.js";
const router = express.Router();

router.post("/google", googleAuth);
export default router;
