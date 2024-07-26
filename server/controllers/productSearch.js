const connection = require('../models/db')
const productSearch = async (req, res)=>{
    const userInput = req.query.q;
    if (!userInput) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    try {
        const query = userInput.replace(/\s+/g, ' & ');
        const result = await connection.query(
            `SELECT * FROM products_table WHERE tsv @@ to_tsquery($1)`,
            [query]
        );
        
        if (result.rows.length === 0) {
            console.log('hello')
            return res.status(404).json({ error: 'No products found matching the search query' });
        }
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.log('failed to get with search', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = productSearch