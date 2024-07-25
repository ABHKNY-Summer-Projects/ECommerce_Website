const {Router} = require('express');
const paymentRouter = Router();

paymentRouter.post('/initialize', initializeTransaction );

paymentRouter.post('/verify', verifyTransaction);


