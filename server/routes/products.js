const express = require('express');
const productCategory = require('../controllers/productCategory')
const allProducts = require('../controllers/allProducts')
const router = express.Router();


// Get all products
router.get('/', allProducts);

// Get products with category
router.get('/category', productCategory);

module.exports = router;
