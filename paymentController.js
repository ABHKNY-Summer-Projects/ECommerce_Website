const { StatusCodes } = require("http-status-codes");
const request = require("request-promise-native");
const db = require("./db");

const initializeTransaction = async (req, res) => {
    try {
        // Validate the request body here
        const { product_id, payment_type, amount, ...paymentDetails } = req.body;

        const developerQuery = "SELECT developer_id FROM products WHERE product_id = $1";
        const developerResult = await db.query(developerQuery, [product_id]);
        const developer_id = developerResult.rows[0].developer_id;

        const keyQuery = "SELECT private_key, public_key FROM developers WHERE developer_id = $1";
        const keyResult = await db.query(keyQuery, [developer_id]);

        const { private_key, public_key } = keyResult.rows[0];

        if (payment_type !== "crowdFund" && req.headers.authorization !== private_key && req.headers.authorization !== public_key) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid Credentials" });
        }

        const callback_url = process.env.MELLA_CALLBACK; // Ensure this is defined in your environment variables

        // Prepare the payment data
        const paymentData = {
            ...paymentDetails,
            product_id,
            amount,
            payment_type
        };

        const options = {
            method: "POST",
            uri: process.env.CHAPA_URL,
            headers: {
                Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
                "Content-Type": "application/json"
            },
            body: paymentData,
            json: true
        };

        const paymentResponse = await request(options);

        // Insert payment details into the database
        const insertPaymentQuery = `
            INSERT INTO payments (tx_ref, currency, product_id, amount, email, first_name, last_name, phone_number, callback_url, return_url, description, payment_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`;

        const insertPaymentValues = [
            paymentResponse.tx_ref,
            paymentResponse.currency,
            product_id,
            amount,
            paymentDetails.email,
            paymentDetails.first_name,
            paymentDetails.last_name,
            paymentDetails.phone_number,
            callback_url,
            paymentDetails.return_url,
            paymentDetails.customization?.description,
            payment_type
        ];

        const insertedPayment = await db.query(insertPaymentQuery, insertPaymentValues);

        let extraInfo = {};

        if (payment_type === "donation") {
            const donationQuery = `
                INSERT INTO donations (payment_id, product_id, amount, message)
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

            const donationValues = [
                insertedPayment.payment_id,
                product_id,
                amount,
                paymentDetails.customization?.description
            ];

            await db.query(donationQuery, donationValues);

            extraInfo = { donationInfo: "Donation successfully recorded" };
        }

        res.status(StatusCodes.OK).json({ message: "Payment processed successfully", paymentDetails: insertedPayment, ...extraInfo });

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