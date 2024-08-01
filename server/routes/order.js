const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Return an order
router.post('/return/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', ['returned', id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel an order
router.post('/cancel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', ['cancelled', id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
