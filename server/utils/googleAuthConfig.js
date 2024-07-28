const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config()
const pool = require("../models/db");

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    pool.query('SELECT * FROM users WHERE googleId = $1', [profile.id], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rows.length > 0) {
            // User exists, pass user to done function
            done(null, results.rows[0]);
        } else {
            // User doesn't exist, create new user
            pool.query('INSERT INTO users (first_name, last_name, email, googleId) VALUES ($1, $2, $3, $4) RETURNING *', [profile.given_name, profile.family_name, profile.email, profile.id], (err, results) => {
                if (err) {
                    throw err;
                }

                // Pass new user to done function
                done(null, results.rows[0]);
            });
        }
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    pool.query(
        `SELECT * FROM users WHERE user_id = $1`, [user.user_id], (err, results) => {
            if (err){
                throw err
            }
            return done(null, results.rows[0]);
        }
    )
});