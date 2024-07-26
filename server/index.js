const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const productRouter = require('./routes/products')
const searchRouter = require('./routes/searchaProduct')
const passport = require("passport");
const userRouter = require("./routes/userRouter");
dotenv.config()


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())


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
middlewares.flash(app);
middlewares.initializeSession(app);
middlewares.initializePassport(app, passport);

// The following middleware currently not used but put for later use
const checkAuthenticated = middlewares.checkAuthenticated
const checkNotAuthenticated = middlewares.checkNotAuthenticated

// Import Authentication Controller
const Authentication_Controller = require('./controllers/Authentication_Controller');

// Set up routes to continue with google

app.use('/products', productRouter);
app.use('/search', searchRouter);


app.get("/", (req, res) => {
    console.log(req.body);
    res.send("Hello World");
});

app.use("/api/users", userRouter)
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

const port = process.env.PORT || 8080;
try {
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}
 catch (error) {
    console.log(error);
    process.exit(1);
}

