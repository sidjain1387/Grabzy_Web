const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Get all menu items for a specific restaurant and branch (protected)
router.get('/all/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 
       ORDER BY item_id`,
      [restaurantId]
    );

    res.status(200).json({ list: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single item by ID (protected)
router.get('/item/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE item_id = $1',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new menu item (protected)
router.post('/add', async (req, res) => {
  const {
    restaurant_id,
    name,
    description,
    price,
    available,
    pieces_left
  } = req.body;

  if (!restaurant_id || !name || !price) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO menu_items 
        ( restaurant_id, name, description, price, available, pieces_left, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [restaurant_id, name, description || '', price, available ?? true, pieces_left || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a menu item (protected)
router.put('/update/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const {
    name,
    description,
    price,
    available,
    pieces_left
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE menu_items SET
        name = $1,
        description = $2,
        price = $3,
        available = $4,
        pieces_left = $5
       WHERE item_id = $6
       RETURNING *`,
      [name, description || '', price, available, pieces_left || '', itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a menu item (protected)
router.delete('/delete/:itemId', async (req, res) => {
  const { itemId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM menu_items WHERE item_id = $1 RETURNING *',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted', item: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
