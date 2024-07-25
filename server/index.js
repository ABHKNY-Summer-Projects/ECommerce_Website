const express = require("express");
const app = express();

// Import passport
const passport = require("passport");

// Define application port
const PORT = process.env.PORT || 4000;

// Import authentication middlewares
const middlewares = require('./middleware/Authentication_Middlewares')

// Incorporate middlewares
middlewares.setViewEngine(app);
middlewares.urlencoded(app);
middlewares.flash(app);
middlewares.initializeSession(app);
middlewares.initializePassport(app, passport);
const checkAuthenticated = middlewares.checkAuthenticated
const checkNotAuthenticated = middlewares.checkNotAuthenticated

// Import Authentication Controller
const Authentication_Controller = require('./controllers/Authentication_Controller');

// REMEMBER TO PUT THE ROUTES IN THEIR RESPECTIVE FOLDERS

app.get('/', Authentication_Controller.render_home);

app.get('/users/login', checkAuthenticated, Authentication_Controller.render_user_login);
app.get('/users/signup', checkAuthenticated, Authentication_Controller.render_user_signup);
app.get('/users/dashboard', checkNotAuthenticated, Authentication_Controller.render_user_dashboard);
app.get('/users/logout', Authentication_Controller.handle_user_logOut);
app.post('/users/signup', Authentication_Controller.handle_user_signUp);
app.post('/users/login', Authentication_Controller.handle_user_login);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

