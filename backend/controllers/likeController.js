import pool from "../utils/database.js";

export const toggleLike = async (req, res) => {
  try {
    const { flashtalk_id } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user_id = req.user.id;

    console.log("LIKE TOGGLE:", { user_id, flashtalk_id });
    const exists = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND flashtalk_id = $2",
      [user_id, flashtalk_id]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND flashtalk_id = $2",
        [user_id, flashtalk_id]
      );
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, flashtalk_id) VALUES ($1, $2)",
        [user_id, flashtalk_id]
      );
    }
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE flashtalk_id = $1",
      [flashtalk_id]
    );

    res.json({
      liked_by_me: exists.rows.length === 0,
      like_count: parseInt(countRes.rows[0].count),
    });
  } catch (err) {
    console.error("toggleLike error:", err.message);
    res.status(500).json({ error: "Failed to toggle like" });
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

export const getLikedTalks = async (req, res) => {
  console.log("getLikedTalks triggered by user:", req.user?.id);

  try {
    const result = await pool.query(
      `SELECT 
         f.*, 
         u.name AS owner_name,
         u.avatar AS owner_avatar,
         COALESCE(lc.like_count, 0) AS like_count,
         TRUE AS liked_by_me,
         CASE WHEN s.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS saved_by_me
       FROM flashtalks f
       JOIN likes l ON f.id = l.flashtalk_id
       JOIN users u ON u.id = f.owner_id
       LEFT JOIN (
         SELECT flashtalk_id, COUNT(*) AS like_count FROM likes GROUP BY flashtalk_id
       ) lc ON lc.flashtalk_id = f.id
       LEFT JOIN saved s ON s.flashtalk_id = f.id AND s.user_id = $1
       WHERE l.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    console.log("Liked videos fetched:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting liked talks:", err.message);
    res.status(500).json({ error: "Failed to fetch liked talks" });
  }
};
