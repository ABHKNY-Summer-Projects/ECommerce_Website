// checkout.js

const pool = require('./db');

async function processCheckout(req, res) {
  const { first_name, last_name, phone, email, items, paymentMethod } = req.body;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const insertOrderText = 'INSERT INTO orders(first_name, last_name, phone, email, payment_method) VALUES($1, $2, $3, $4, $5) RETURNING id';
      const insertOrderValues = [first_name, last_name, phone, email, paymentMethod];
      const orderResult = await client.query(insertOrderText, insertOrderValues);

      const orderId = orderResult.rows[0].id;

      const insertItemText = 'INSERT INTO order_items(order_id, item_name, item_price) VALUES($1, $2, $3)';
      for (const item of items) {
        await client.query(insertItemText, [orderId, item.name, item.price]);
      }

      await client.query('COMMIT');
      res.status(200).send({ message: 'Order placed successfully' });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error placing order', err);
    res.status(500).send({ message: 'Error placing order' });
  }
}

module.exports = { processCheckout };
