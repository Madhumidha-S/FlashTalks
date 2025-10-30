import { pool } from "../config/db.js";

export const getFlashtalks = async (req, res) => {
  try {
    const { q = "", tags = "", page = 1, limit = 6 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT f.*, u.name AS owner_name, 
        (SELECT COUNT(*) FROM likes WHERE flashtalk_id=f.id) AS likes_count
      FROM flashtalks f
      JOIN users u ON f.owner_id = u.id
      WHERE status='published'
      AND (to_tsvector('english', f.title || ' ' || f.blurb) @@ plainto_tsquery($1)
        OR $1 = '')
      AND (CASE WHEN $2 <> '' THEN $2 = ANY(f.tags) ELSE TRUE END)
      ORDER BY f.created_at DESC
      LIMIT $3 OFFSET $4;
    `;

    const talks = await pool.query(query, [q, tags, limit, offset]);
    res.json(talks.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flashtalks" });
  }
};

export const createFlashtalk = async (req, res) => {
  try {
    const { title, blurb, tags, duration_min } = req.body;
    const { id: userId } = req.user;

    const newTalk = await pool.query(
      `INSERT INTO flashtalks (title, blurb, tags, duration_min, owner_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, blurb, tags, duration_min, userId]
    );

    res.status(201).json(newTalk.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create flashtalk" });
  }
};
