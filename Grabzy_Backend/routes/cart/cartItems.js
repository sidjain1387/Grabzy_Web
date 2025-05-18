const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Get all items in a cart
router.get('/all/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const result = await pool.query(
      `SELECT item_id AS "itemId", quantity 
       FROM cart_items 
       WHERE cart_id = $1`,
      [cartId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('Error fetching cart items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET ALL CART ITEMS FOR A USER WITH RESTAURANT DETAILS
router.get('/all_items_with_restaurant/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const query = `
      SELECT
        menu_items.item_id AS itemId,
        menu_items.name AS name,
        menu_items.price AS price,
        cart_items.quantity AS quantity,
        restaurants.name AS restaurant_name
      FROM cart_items
      JOIN menu_items ON cart_items.item_id = menu_items.item_id
      JOIN restaurants ON menu_items.restaurant_id = restaurants.restaurant_id
      WHERE cart_items.cart_id = $1;
    `;

    const result = await pool.query(query, [cartId]);

    res.json({ items: result.rows });
  } catch (err) {
    console.error('Error fetching cart items:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1. Add item to cart
router.post('/add-item', async (req, res) => {
    const { cartId, itemId } = req.body;
    if (!cartId || !itemId) return res.status(400).json({ error: 'Missing cartId or itemId' });

    try {
        // Check if item already in cart
        const existing = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2',
            [cartId, itemId]
        );


        if (existing.rows.length > 0) {
            // If yes, increase quantity
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 AND item_id = $2',
                [cartId, itemId]
            );
            return res.json({ message: 'Quantity increased' });
        } else {
            // If not, insert new row
            await pool.query(
                'INSERT INTO cart_items (cart_id, item_id, quantity) VALUES ($1, $2, 1)',
                [cartId, itemId]
            );
            return res.json({ message: 'Item added to cart' });
        }
    } catch (err) {
        console.error('Add item error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Increase quantity
router.put('/increase-qty', async (req, res) => {
    const { cartId, itemId } = req.body;
    try {
        await pool.query(
            'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 AND item_id = $2',
            [cartId, itemId]
        );
        res.json({ message: 'Quantity increased' });
    } catch (err) {
        console.error('Increase qty error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Decrease quantity
router.put('/decrease-qty', async (req, res) => {
    const { cartId, itemId } = req.body;
    try {
        // Check current quantity
        const result = await pool.query(
            'SELECT quantity FROM cart_items WHERE cart_id = $1 AND item_id = $2',
            [cartId, itemId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Item not in cart' });

        if (result.rows[0].quantity <= 1) {
            // Remove item if quantity will be zero
            await pool.query(
                'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2',
                [cartId, itemId]
            );
            return res.json({ message: 'Item removed from cart' });
        } else {
            await pool.query(
                'UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = $1 AND item_id = $2',
                [cartId, itemId]
            );
            return res.json({ message: 'Quantity decreased' });
        }
    } catch (err) {
        console.error('Decrease qty error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Remove item
router.delete('/remove-item', async (req, res) => {
    const { cartId, itemId } = req.body;
    try {
        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND item_id = $2',
            [cartId, itemId]
        );
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error('Remove item error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
