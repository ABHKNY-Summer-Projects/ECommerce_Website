const express = require('express')
const searchProduct = require('../controllers/productSearch')

const router = express.Router()

// to get products with search
router.get('/', searchProduct)


module.exports = router