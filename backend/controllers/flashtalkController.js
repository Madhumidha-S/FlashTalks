import pool from "../utils/database.js";

export const createTalk = async (req, res) => {
  const { title, blurb, tags, duration_min } = req.body;
  const owner_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO flashtalks (title, blurb, tags, duration_min, owner_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, blurb, tags || [], duration_min, owner_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublishedTalks = async (req, res) => {
  const { q = "", page = 1, limit = 10 } = req.query;
  const userId = req.user?.id || null;
  const offset = (page - 1) * limit;
  try {
    const query = `
      SELECT 
        f.*,
        u.name AS owner_name,
        u.avatar AS owner_avatar,
        COALESCE(lc.like_count, 0) AS like_count,
        COALESCE(sc.save_count, 0) AS save_count,
        CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_me,
        CASE WHEN us.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS saved_by_me
      FROM flashtalks f
      JOIN users u ON u.id = f.owner_id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS like_count FROM likes GROUP BY flashtalk_id
      ) lc ON lc.flashtalk_id = f.id
      LEFT JOIN (
        SELECT flashtalk_id, COUNT(*) AS save_count FROM saved GROUP BY flashtalk_id
      ) sc ON sc.flashtalk_id = f.id
      LEFT JOIN likes ul ON ul.flashtalk_id = f.id AND ul.user_id = $3
      LEFT JOIN saved us ON us.flashtalk_id = f.id AND us.user_id = $3
      WHERE f.status = 'published'
      AND (to_tsvector('english', f.title || ' ' || f.blurb) @@ plainto_tsquery('english', $1) OR $1 = '')
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $4;
    `;
    const result = await pool.query(query, [q, limit, userId, offset]);
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM flashtalks
       WHERE status='published' 
       AND (to_tsvector('english', title || ' ' || blurb) @@ plainto_tsquery('english', $1) OR $1 = '')`,
      [q]
    );

    const total = parseInt(countRes.rows[0].count);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      results: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateTalkStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE flashtalks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyTalks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM flashtalks WHERE owner_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
