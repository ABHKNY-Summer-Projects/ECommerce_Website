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
            res.render('signup', {errors})
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
                        errors.push({message: "Email Already Registered"});
                        res.render('signup', { errors });
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
                                console.log(results.rows);
                                req.flash('success_msg', 'You are now registered. Please Log in');
                                res.redirect('/users/login');
                            }
                        )
                    }
                }
            )
        }
    },
    
    handle_user_logOut: (req, res) => {
        req.logOut((err) => {
            if (err){
                return err;
            }
            req.flash('success_msg', 'You have logged out');
            res.redirect('/users/login');
        })
    }, 

    handle_user_login: passport.authenticate('local', {
            successRedirect: '/users/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        }),

    render_home: (req, res) => {
        res.render('home');
    },

    render_user_login: (req, res) => {
        res.render('login');
    },

    render_user_signup: (req, res) => {
        res.render('signup');
    },

    render_user_dashboard: (req, res) => {
        res.render('Dashboard',  {user: req.user.name});
    }

}