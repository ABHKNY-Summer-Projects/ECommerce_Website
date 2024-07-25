const { StatusCodes } = require("http-status-codes");
const request = require("request-promise-native");
const db = require("../models/db");



const initializeTransaction = async (req, res) => {
    try {

        const user_id = 2;
        // Validate the request body here
        const { amount } = req.body;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const randomNu = getRandomInt(1,10000);

        

        const tx_ref = `summer-${randomNu}`;

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
            tx_ref : "tx_ref-7899uo9ikonnuiooooo9dd",
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

       

        res.status(StatusCodes.OK).json({ message: "Payment processed successfully", paymentDetails: JSON.parse(paymentResponse.body) });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

const verifyTransaction = async (req, res) => {
    try {
        const { tx_ref } = req.query;

        const selectPaymentQuery = "SELECT * FROM payments WHERE tx_ref = $1";
        const paymentResult = await db.query(selectPaymentQuery, [tx_ref]);

        if (paymentResult.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Transaction reference not found" });
        }

        const payment = paymentResult.rows[0];
        
        const updatePaymentQuery = "UPDATE payments SET status = TRUE WHERE payment_id = $1 RETURNING *";
        const updatedPayment = await db.query(updatePaymentQuery, [payment.payment_id]);

        res.status(StatusCodes.OK).json({ message: "Transaction verified successfully", updatedPayment });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

module.exports = { initializeTransaction, verifyTransaction };