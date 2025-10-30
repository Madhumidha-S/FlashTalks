import { pool } from "../config/db.js";

export const toggleLike = async (req, res) => {
  const { id: user_id } = req.user;
  const { flashtalk_id } = req.params;

  try {
    const existing = await pool.query(
      "SELECT * FROM likes WHERE user_id=$1 AND flashtalk_id=$2",
      [user_id, flashtalk_id]
    );

    if (existing.rows.length) {
      await pool.query(
        "DELETE FROM likes WHERE user_id=$1 AND flashtalk_id=$2",
        [user_id, flashtalk_id]
      );
      return res.json({ liked: false });
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, flashtalk_id) VALUES ($1, $2)",
        [user_id, flashtalk_id]
      );
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

export const toggleSave = async (req, res) => {
  const { id: user_id } = req.user;
  const { flashtalk_id } = req.params;

  try {
    const existing = await pool.query(
      "SELECT * FROM saved WHERE user_id=$1 AND flashtalk_id=$2",
      [user_id, flashtalk_id]
    );

    if (existing.rows.length) {
      await pool.query(
        "DELETE FROM saved WHERE user_id=$1 AND flashtalk_id=$2",
        [user_id, flashtalk_id]
      );
      return res.json({ saved: false });
    } else {
      await pool.query(
        "INSERT INTO saved (user_id, flashtalk_id) VALUES ($1, $2)",
        [user_id, flashtalk_id]
      );
      return res.json({ saved: true });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle save" });
  }
};
