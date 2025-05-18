const express = require('express');
const router = express.Router();
const pool = require('../../db'); // your PostgreSQL pool

// Get all restaurants (protected)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants where owner_id=$1 ORDER BY restaurant_id', [req.user.userId]);
    res.status(200).json({ list: result.rows });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all_with_no_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY restaurant_id');
    res.status(200).json({ list: result.rows });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});



// Add a new restaurant (protected)
router.post('/add', async (req, res) => {
  const { name, address, description, has_branches } = req.body;

  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (name, address, description, have_branches,owner_id)
       VALUES ($1, $2, $3, $4,$5) RETURNING *`,
      [name, address, description || '', has_branches || false, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a restaurant by id (protected)
router.put('/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, description, has_branches } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurants SET
        name = $1,
        address = $2,
        description = $3,
        has_branches = $4
       WHERE restaurant_id = $5
       RETURNING *`,
      [name, address, description || '', has_branches || false, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM restaurants WHERE restaurant_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted', restaurant: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
