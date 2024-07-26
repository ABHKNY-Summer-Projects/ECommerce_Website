// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { processCheckout } = require('./checkOut');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/checkout', processCheckout);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
