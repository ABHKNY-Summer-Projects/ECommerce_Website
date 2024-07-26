const passport = require("passport");
const bcrypt = require('bcrypt');

// Import pool to interact with DB
const { pool } = require("../utils/dbconfig");

module.exports = {

    handle_user_signUp: async (req, res) => {
        let {name, email, password, password2} = req.body;
    
        let errors = [];
    
        if (!name || !email || !password || !password2){
            errors.push({message: "Please Enter All Fields"})
        };
    
        if (password.length < 6){
            errors.push({message: "Your password is too short"})
        }
    
        if (password !== password2){
            errors.push({message: "Passowords Don't Match"})
        }
    
        if(errors.length > 0){
            res.json({errors: errors});
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
                        // Account already registered
                        errors.push({message: "Email Already Registered"});
                        res.json({errors: errors});
                    }else{
                        // User Registry
                        pool.query(
                            `INSERT INTO users (name, email, password)
                            VALUES ($1, $2, $3)
                            RETURNING id, password`, [name, email, hashedPassword],
                            (err, results) => {
                                if (err){
                                    throw err
                                }
                                res.json({success_msg: 'You are now registered. Please Log in'});
                            }
                        )
                    }
                }
            )
        }
    },
    
    handle_user_login: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
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