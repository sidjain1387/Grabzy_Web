const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db'); // PostgreSQL pool connection
require('dotenv').config();

// Sign up
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // role can be 'customer' or 'owner'

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].user_id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.rows[0].user_id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
