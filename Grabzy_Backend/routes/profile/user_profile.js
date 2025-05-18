const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Your PostgreSQL setup

// GET profile
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, email, phone_number, address FROM users WHERE user_id = $1', [req.user.userId]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update profile
router.put('/edit', async (req, res) => {
    const { name, email, phone_number, address } = req.body;

    try {
        const { rows } = await pool.query(
            `UPDATE users SET name = $1, email = $2, phone_number = $3, address = $4 WHERE user_id = $5 RETURNING name, email, phone_number, address`,
            [name, email, phone_number, address, req.user.userId]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;
