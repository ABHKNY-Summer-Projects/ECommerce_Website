const passport = require("passport");
const bcrypt = require('bcrypt');

// Import pool to interact with DB
const pool = require("../models/db");

module.exports = {

    handle_user_signUp: async (req, res) => {
        let {firstName, lastName, email, password, password2} = req.body;
    
        let messages = [];
    
        if (!firstName || !lastName || !email || !password || !password2){
            messages.push({message: "Please Enter All Fields"})
        };
    
        if (password.length < 6){
            messages.push({message: "Your password is too short"})
        }
    
        if (password !== password2){
            messages.push({message: "Passowords Don't Match"})
        }
    
        if(messages.length > 0){
            res.json({messages: messages});
        }
        else{
            // Form validation successful
    
            let hashedPassword = await bcrypt.hash(password, 10);
            
            // Check if user already exists
            pool.query(
                `SELECT * FROM users 
                WHERE email = $1`, [email], (err, results) => {
                    if (err){
                        throw err
                    }
    
                    if (results.rows.length > 0){
                        // Account alreALTER TABLE users DROP COLUMN user_name;ady registered
                        messages.push({message: "Email Already Registered"});
                        res.json({messages: messages});
                    }else{
                        // User Registry
                        pool.query(
                            `INSERT INTO users (first_name, last_name, email, password)
                            VALUES ($1, $2, $3, $4)
                            RETURNING user_id, password`, [firstName, lastName, email, hashedPassword],
                            (err, results) => {
                                if (err){
                                    throw err
                                }
                                messages.push({message: "You are now registered. Please Log in"});
                                res.json({messages: messages});
                            }
                        )
                    }
                }
            )
        }

        pool.queryRunner('select * from users');
    },
    
    handle_user_login: (req, res, next) => {
        pool.queryRunner('select * from users');

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log(err);
                return res.json({ status: 'error', message: err });
            }
            if (!user) {
                return res.json({ status: 'error', message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.json({ status: 'error', message: err });
                }
                return res.json({ status: 'success', message: 'Logged in', user: req.user });
            });
        })(req, res, next);
    },

    handle_user_logOut: (req, res) => {
        req.logOut((err) => {
            if (err){
                return err;
            }

            req.session.destroy();
            res.json({success_msg: 'You have successfully logged out'});
        })
    }
}