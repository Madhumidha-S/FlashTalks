import pool from "../utils/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { tokenID } = req.body;
    console.log("Received tokenID:", tokenID ? "Present" : "Missing");

    const ticket = await client.verifyIdToken({
      idToken: tokenID,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: google_id, email, name, picture: avatar } = payload;

    let userRes = await pool.query("SELECT * FROM users WHERE google_id = $1", [
      google_id,
    ]);

    let user;

    if (userRes.rows.length === 0) {
      const insertRes = await pool.query(
        "INSERT INTO users (google_id, email, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *",
        [google_id, email, name, avatar]
      );
      user = insertRes.rows[0];
    } else {
      user = userRes.rows[0];
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(401).json({ error: "Invalid Google token" });
  }
};
