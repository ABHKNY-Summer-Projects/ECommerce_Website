const express = require("express");
const flash = require('express-flash');
const initializePassport = require('../utils/passportConfig');
const session = require('express-session');


module.exports = {
    setViewEngine: (app) => {
        app.set('view engine', "ejs");
    },

    urlencoded: (app) => {
        app.use(express.urlencoded({extended: false}));
    },

    initializeSession: (app) => {
        app.use(session({ 
            secret: 'secret-key',
            resave: false,
            saveUninitialized: false
        }));
    },

    initializePassport: (app, passport) => {
        initializePassport(passport);
        app.use(passport.initialize());
        app.use(passport.session());
    },

    flash: (app) => {
        app.use(flash());
    },

    checkAuthenticated: function(req, res, next){
        if (req.isAuthenticated()){
            return res.redirect('/users/dashboard')
        }
        next();
    },

    checkNotAuthenticated: function(req, res, next){
        if (req.isAuthenticated()){
            return next()
        };
        res.redirect('/');
    }
}