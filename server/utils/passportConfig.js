const LocalStrategy = require("passport-local").Strategy;
const pool = require('../models/db');
const bycrypt = require("bcrypt");

const authenticateUser = (email, password, done) => {
    pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
        (err, results) => {
            if(err){
                throw err
            }

            if (results.rows.length > 0){
                // User found in the DB
                const user = results.rows[0];

                // Compare passwords
                bycrypt.compare(password, user.password, (err, is_match) => {
                    if (err){
                        throw err;
                    }

                    if (is_match){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: "Incorrect Password" })
                    }
                });
            } else{
                // No user found
                return done(null, false, { message: "User not found"})
            }
        }
    )
}

function initialize (passport){
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser)
    );

    passport.serializeUser((user, done) => {
        // Store userId in Session
        done(null, user.user_id);
    });

    passport.deserializeUser((user, done) => {
        // Get user info from session 
        pool.query(
            `SELECT * FROM users WHERE user_id = $1`, [user.user_id], (err, results) => {
                if (err){
                    throw err
                }
                return done(null, results.rows[0]);
            }
        )
    })
}

module.exports = initialize;