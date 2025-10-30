import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { verifyGoogleToken } from '../utils/verifyGoogleToken.js';

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const payload = await verifyGoogleToken(idToken);

    const { sub: google_id, email, name, picture: avatar } = payload;

    let user = await pool.query('SELECT * FROM users WHERE google_id=$1', [google_id]);

    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO users (google_id, email, name, avatar)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [google_id, email, name, avatar]
      );
    } else {
      user = { rows: [user.rows[0]] };
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Google authentication failed' });
  }
};
