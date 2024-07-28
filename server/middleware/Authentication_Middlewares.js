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
            saveUninitialized: false,
            cookie: { secure: false }
        }));
    },

    initializePassport: (app, passport) => {
        initializePassport(passport);
        app.use(passport.initialize());
        app.use(passport.session());
    }
}