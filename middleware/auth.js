import jwt from "jsonwebtoken";
import pool from "../utils/database.js";

export const authRequired = async (req, res, next) => {
  try {
    console.log("authRequired triggered");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid Authorization header");
      return res.status(401).json({ error: "Unauthorized - missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    console.log("Decoded token:", decoded);

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);

    if (result.rows.length === 0) {
      console.log("User not found in DB");
      return res.status(401).json({ error: "Unauthorized - user not found" });
    }

    req.user = result.rows[0];
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("authRequired error:", err.message);
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }
};

export const curatorOnly = (req, res, next) => {
  if (req.user?.role !== "curator") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
