const connection = require('../models/db')
const allProduct = async (req, res) => {
    try {
        const response = await connection.query('SELECT * FROM products_table');

        if (response.rows.length === 0) {
            return res.status(404).send('No products available.');
        }
        const data = response.rows;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send("Failed to get data.");
    }
}

module.exports = allProduct