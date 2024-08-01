const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const pool = new Pool({

    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: "Yonatize",
    database: 'Products'
});

// Get all orders
app.get('/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM order_details');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get order by ID
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const orderResult = await pool.query('SELECT * FROM order_details WHERE id = $1', [id]);
        const itemsResult = await pool.query('SELECT * FROM order_item WHERE order_id = $1', [id]);
        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Return an order
app.post('/orders/return/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE order_details SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', ['returned', id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel an order
app.post('/orders/cancel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE order_details SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', ['cancelled', id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save changes to an order
app.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, payment_id, shipment_id, total } = req.body;
    try {
        const result = await pool.query(
            'UPDATE order_details SET user_id = $1, payment_id = $2, shipment_id = $3, total = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [user_id, payment_id, shipment_id, total, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add items to an order
app.post('/orders/:id/items', async (req, res) => {
    const { id } = req.params;
    const { product_id, products_sku_id, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO order_item (order_id, product_id, products_sku_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
            [id, product_id, products_sku_id, quantity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
