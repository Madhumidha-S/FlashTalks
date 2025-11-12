/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Video upload and playback
 */

/**
 * @swagger
 * /api/upload/upload-url:
 *   get:
 *     summary: Get presigned S3 upload URL
 *     tags: [Upload]
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: fileType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Presigned URL generated
 */

/**
 * @swagger
 * /api/upload/save:
 *   post:
 *     summary: Save uploaded video metadata
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video saved successfully
 */

import express from "express";
import {
  getUploadUrl,
  saveVideo,
  getPlayUrl,
} from "../controllers/uploadController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();
router.get("/upload-url", authRequired, getUploadUrl);
router.get("/play-url", getPlayUrl);
router.post("/save", authRequired, saveVideo);
export default router;
