const { StatusCodes } = require("http-status-codes");
const request = require("request-promise-native");
const db = require("../models/db");
const { getRandomInt } = require('./randomUtil');


const initializeTransaction = async (req, res) => {
    try {

        const user_id = req.user.user_id;
        // Validate the request body here
        const { product_id, payment_type, amount } = req.body;

        const randomNu = getRandomInt(1,10000);

        const trx_ref = `summer-${randomNu}`;

        const userQuery = 'SELECT first_name, last_name, email, phone_number FROM users WHERE user_id = $1'
        const userInfo = await db.query(userQuery, [user_id]);
        const result = userInfo.rows[0];
        const { first_name, last_name, email, phone_number} = result;

       
        const callback_url = process.env.SUMMER_01_CALLBACK; // Ensure this is defined in your environment variables

        // Prepare the payment data
        const paymentData = {
            customization : {
                title : "Summer 01",
                description : "Payment"
            },
            first_name: first_name,
            last_name : last_name,
            email : email,
            phone_number: phone_number,
            amount : amount,
            callback_url : callback_url,
            trx_ref : trx_ref,
            currency : "ETB"
        };

        const options = {
            method: "POST",
            uri: process.env.CHAPA_URL,
            headers: {
                Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentData),
            
        };

        const paymentResponse = await request(options);

        // Insert payment details into the database
        const insertPaymentQuery = `
            INSERT INTO payments (tx_ref, currency, amount, email, first_name, last_name, phone_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;

        const insertPaymentValues = [
            paymentResponse.tx_ref,
            paymentResponse.currency,
            amount,
            paymentData.email,
            paymentData.first_name,
            paymentData.last_name,
            paymentData.phone_number,
            
        ];

        const insertedPayment = await db.query(insertPaymentQuery, insertPaymentValues);

       

        res.status(StatusCodes.OK).json({ message: "Payment processed successfully", paymentDetails: insertedPayment });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

const verifyTransaction = async (req, res) => {
    try {
        const { trx_ref } = req.query;

        const selectPaymentQuery = "SELECT * FROM payments WHERE tx_ref = $1";
        const paymentResult = await db.query(selectPaymentQuery, [trx_ref]);

        if (paymentResult.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Transaction reference not found" });
        }

        const payment = paymentResult.rows[0];
        
        // Perform any necessary checks or processing related to the verified transaction

        // Update payment status in the database
        const updatePaymentQuery = "UPDATE payments SET status = TRUE WHERE payment_id = $1 RETURNING *";
        const updatedPayment = await db.query(updatePaymentQuery, [payment.payment_id]);

        res.status(StatusCodes.OK).json({ message: "Transaction verified successfully", updatedPayment });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

module.exports = { initializeTransaction, verifyTransaction };