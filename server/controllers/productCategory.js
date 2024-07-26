const connection = require('../models/db')
const products = async (req, res) => {
    const category = req.query.category;

    if (!category) {
        return res.status(400).send('Bad request: category is required.');
    }

    try {
        const response = await connection.query('SELECT * FROM products_table WHERE product_category = $1', [category]);
        if (response.rows.length === 0) {
            return res.status(404).send('Product not found.');
        }

        const data = response.rows;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send("Failed to get data.");
    }
}

module.exports = products