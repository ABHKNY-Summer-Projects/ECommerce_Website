const {StatusCodes} = require("http-status-codes")
const bcrypt = require("bcrypt")
const db = require("../models/db.js")



const getUserDetails = async (req, res) => {
    try {
        // TODO: add user authenticator middleware to get user_id in the method given below
        const user_id = req.session.passport.user
        const Detailquery = "SELECT * FROM users WHERE user_id = $1"
        const result = await db.query(Detailquery, [user_id])
        if(result.rows.length === 0) {
            res.status(StatusCodes.FORBIDDEN).json({error:"Error fetching user results"})
            return
        }
        const userInfo = result.rows[0]

        delete userInfo.password
        res.status(StatusCodes.OK).json({userInfo})
    } catch(error) {
        console.log(error.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error"})
    }
} 

const updateUserDetails = async (req,res) => {
    try {
        // TODO: add user authenticator middleware to get user_id in the method given below
        const user_id = req.session.passport.user
        const updated = req.body
        const {
            first_name,
            last_name,
            email,
            address,
            old_password,
            new_password
        } = updated
        const userQuery = "SELECT password FROM users WHERE user_id = $1"
        const result = await db.query(userQuery, [user_id])
        
        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({error:"User not found"})
            return
        }
        console.log(result)
        const {password} = result.rows[0]

        console.log(password, old_password)
        const passwordMatch = await bcrypt.compare(old_password, password)

        if (!passwordMatch) {
            res.status(StatusCodes.NOT_ACCEPTABLE).json({error:"Invalid credentials"})
            return 
        }
        const newPassHashed = await bcrypt.hash(new_password, 10)
        const updateQuery = "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, address = $5 WHERE user_id = $6"
        const updateResult = await db.query(updateQuery, [first_name, last_name, email, newPassHashed, address, user_id])

        const successResult = updateResult.rows[0]
        res.status(StatusCodes.OK).json({msg : "User information updated"})

    } catch(error) {
        console.log(error.stack) 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Internal Server Error"})
    }

}

const deleteUser = async (req,res) => {
    try {
        // TODO: add user authenticator middleware to get user_id in the method given below
        const user_id = req.session.passport.user
        const {user_password} = req.body
        const passwordQuery = "SELECT password FROM users WHERE user_id = $1"
        const result = await db.query(passwordQuery, [user_id])
        if (result.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({error:"User not found"})
            return
        }
        const password = result.rows[0].password
        const passwordMatch = await bcrypt.compare(user_password, password)
        if (!passwordMatch) {
            res.status(StatusCodes.NOT_ACCEPTABLE).json({error:"Invalid credentials, can not delete account"})
            return 
        }

        const deleteQuery = "UPDATE users SET status = FALSE WHERE user_id = $1"
        await db.query(deleteQuery, [user_id])
        const cartDelete = "DELETE FROM carts WHERE user_id = $1" 
        await db.query(cartDelete,[user_id])
        const wishlistDelete = "DELETE FROM wishlist WHERE user_id = $1"
        await db.query(wishlistDelete,[user_id])

        res.status(StatusCodes.OK).json({msg:"User account deleted successfully"})

    } catch(error) {
        console.log(error.stack)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Internal Server Error"})
    }
}

module.exports = {getUserDetails, updateUserDetails, deleteUser}