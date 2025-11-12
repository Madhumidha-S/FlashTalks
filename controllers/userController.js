import pool from "../utils/database.js";

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, avatar, role FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
