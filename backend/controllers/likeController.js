import pool from "../utils/database.js";

export const toggleLike = async (req, res) => {
  const { flashtalk_id } = req.body;
  const user_id = req.user.id;

  try {
    const exists = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND flashtalk_id = $2",
      [user_id, flashtalk_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND flashtalk_id = $2",
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
    res.status(500).json({ error: err.message });
  }
};

export const getLikesCount = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE flashtalk_id = $1",
      [id]
    );
    res.json({ count: parseInt(count.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
