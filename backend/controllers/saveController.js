import pool from "../utils/database.js";

export const toggleSave = async (req, res) => {
  try {
    const { flashtalk_id } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user_id = req.user.id;

    console.log("SAVE TOGGLE:", { user_id, flashtalk_id });

    const exists = await pool.query(
      "SELECT 1 FROM saved WHERE user_id = $1 AND flashtalk_id = $2",
      [user_id, flashtalk_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        "DELETE FROM saved WHERE user_id = $1 AND flashtalk_id = $2",
        [user_id, flashtalk_id]
      );
    } else {
      await pool.query(
        "INSERT INTO saved (user_id, flashtalk_id) VALUES ($1, $2)",
        [user_id, flashtalk_id]
      );
    }

    // Return updated count + status
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM saved WHERE flashtalk_id = $1",
      [flashtalk_id]
    );

    res.json({
      saved_by_me: exists.rows.length === 0,
      save_count: parseInt(countRes.rows[0].count),
    });
  } catch (err) {
    console.error("toggleSave error:", err.message);
    res.status(500).json({ error: "Failed to toggle save" });
  }
};

export const getSavedTalks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT
        f.*,
        u.name AS owner_name,
        u.avatar AS owner_avatar,
        COALESCE(lc.like_count, 0) AS like_count,
        COALESCE(sc.save_count, 0) AS save_count,
        CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_me,
        TRUE AS saved_by_me
      FROM flashtalks f
      JOIN saved s ON s.flashtalk_id = f.id
      JOIN users u ON u.id = f.owner_id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS like_count
        FROM likes
        GROUP BY flashtalk_id
      ) lc ON lc.flashtalk_id = f.id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS save_count
        FROM saved
        GROUP BY flashtalk_id
      ) sc ON sc.flashtalk_id = f.id
      LEFT JOIN likes l ON l.flashtalk_id = f.id AND l.user_id = $1
      WHERE s.user_id = $1
        AND f.status = 'published'
      ORDER BY f.created_at DESC;
      `,
      [userId]
    );

    console.log(
      `Saved videos fetched for user ${userId}: ${result.rows.length}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting saved talks:", err.message);
    res.status(500).json({ error: "Failed to fetch saved talks" });
  }
};
