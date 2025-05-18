const express = require('express');
const router = express.Router();
const pool = require('../../db'); // PostgreSQL pool instance

// POST /cart/create
router.post('/create', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId in request body.' });
    }

    try {
        // Check if cart already exists for this user
        const existingCart = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [userId]
        );

        if (existingCart.rows.length > 0) {
            return res.status(200).json({ message: 'Cart already exists for user.', cart: existingCart.rows[0] });
        }

        // Insert new cart
        const result = await pool.query(
            'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
            [userId]
        );

        res.status(201).json({ message: 'Cart created successfully.', cart: result.rows[0] });
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ error: 'Server error while creating cart.' });
    }
});

router.get('/get', async (req, res) => {
    const userId = req.user.userId; 

  try {
    const cartQuery = await pool.query(
      'SELECT cart_id FROM carts WHERE customer_id = $1',
      [userId]
    );

    if (cartQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.json({ cart_id: cartQuery.rows[0].cart_id });
  } catch (error) {
    console.error('Error getting cart_id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
