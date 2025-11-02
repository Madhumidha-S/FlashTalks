import pool from "../utils/database.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { tokenID } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenID,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const {
      sub: google_id,
      email,
      name,
      picture: avatar,
    } = ticket.getPayload();
    let user = await pool.query("SELECT * FROM users WHERE google_id = $1", [
      google_id,
    ]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (google_id, email, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *",
        [google_id, email, name, avatar]
      );
    } else {
      user = user.rows[0];
    }

    const u = user.rows[0];
    const token = jwt.sign(
      { id: u.id, email: u.email, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: u });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
};
