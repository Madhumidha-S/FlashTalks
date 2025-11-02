import pool from "../utils/database.js";

export const toggleSave = async (req, res) => {
  const { flashtalk_id } = req.body;
  const user_id = req.user.id;

  try {
    const exists = await pool.query(
      "SELECT * FROM saved WHERE user_id = $1 AND flashtalk_id = $2",
      [user_id, flashtalk_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        "DELETE FROM saved WHERE user_id = $1 AND flashtalk_id = $2",
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
    res.status(500).json({ error: err.message });
  }
};

export const getSavedTalks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.* FROM flashtalks f
       JOIN saved s ON f.id = s.flashtalk_id
       WHERE s.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
