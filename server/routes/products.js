const express = require('express')
const router = express.Router()
const {Client} = require('pg')

const connection = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: "Yonatize",
    database: 'Products'
})

connection.connect()
.then(()=>{
    console.log('connected to database');
})
.catch(err=>{
    console.log('error occured while conecting to db')
})

// to get all products
router.get('/', async(req, res)=>{
    try {
        const response = await connection.query('select * from products_table');

        if (response.rows.length === 0){
            return res.status(500).send('No product available.');
        }
        const data = response.rows;
        res.status(200).json(data)
    } catch (error) {
        console.log('Error fetching data:', error)
        res.status(500).send("faild to get data")
    }
    

})

// to get products with category
router.get('/:id', async (req, res)=>{
    const userId = parseInt(req.params.id);
    if (isNaN(userId) || userId <= 0){
        return res.status(400).send('bad request');
    }
    try {
        const response = await connection.query('SELECT * FROM products_table WHERE id = $1', [userId]);
        if (response.rows.length === 0) {
            return res.status(404).send('Teacher not found');
        }

        const data = response.rows;
        // console.log(data);
        res.status(200).json(data);

    } catch (error) {
        console.log('Error fetching data:', error)
        res.status(500).send("faild to get data")
    }
})


module.exports = router
