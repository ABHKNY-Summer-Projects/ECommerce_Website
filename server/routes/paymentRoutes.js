const {Router} = require('express');
const paymentRouter = Router();

const {initializeTransaction, verifyTransaction} = require('../controllers/paymentController');
paymentRouter.post('/initialize', initializeTransaction );
paymentRouter.post('/verify', verifyTransaction);



module.exports = paymentRouter ;


