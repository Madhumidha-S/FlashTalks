import { generateUploadURL } from "../utils/s3.js";
import pool from "../utils/database.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getPlayUrl = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key parameter" });
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    const playUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ playUrl });
  } catch (error) {
    console.error("Error generating play URL:", error);
    res.status(500).json({ error: "Failed to generate play URL" });
  }
};

export const getUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType)
      return res.status(400).json({ error: "Missing fileName or fileType" });
    const uploadUrl = await generateUploadURL(fileName, fileType);
    const videoUrl = uploadUrl.split("?")[0];
    console.log("Generated presigned URL:", uploadUrl);
    res.json({ uploadUrl, videoUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

export const saveVideo = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, videoUrl, thumbnailUrl, tags = [] } = req.body;

    // const owner_id = 1;
    const owner_id = req.user.id;

    if (!title || !videoUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await pool.query(
      `INSERT INTO flashtalks
        (title, blurb, video_url, thumbnail_url, owner_id, tags, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW(), NOW())
       RETURNING *`,
      [title, description, videoUrl, thumbnailUrl || null, owner_id, tags]
    );
    res.json({ success: true, flashtalk: result.rows[0] });
  } catch (err) {
    console.error("Error saving video:", err);
    res.status(500).json({ error: "Saving video info failed" });
  }
};
