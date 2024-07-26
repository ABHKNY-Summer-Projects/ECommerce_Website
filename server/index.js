const express = require("express");
const app = express();
const cors = require('cors');
const passport = require("passport");
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Import google Authentication configuration
require('./utils/googleAuthConfig');

// Import authentication middlewares
const middlewares = require('./middleware/Authentication_Middlewares')

// Setup CORS middleware for react apps
app.use(cors({
  origin: 'http://localhost:5173', // Route for front-end app
  credentials: true
}));

// Incorporate middlewares
middlewares.setViewEngine(app);
middlewares.urlencoded(app);
middlewares.initializeSession(app);
middlewares.initializePassport(app, passport);

// The following middleware currently not used but put for later use
const checkAuthenticated = middlewares.checkAuthenticated
const checkNotAuthenticated = middlewares.checkNotAuthenticated

// Import Authentication Controller
const Authentication_Controller = require('./controllers/Authentication_Controller');

// Set up routes to continue with google
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: 'DASHBOARD PATH', 
        failureRedirect: '/api/users/login'
}));

app.post('/api/users/signup', Authentication_Controller.handle_user_signUp);
app.post('/api/users/login', Authentication_Controller.handle_user_login);
app.get('/api/users/logout', Authentication_Controller.handle_user_logOut);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

