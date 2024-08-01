const express = require("express");

const auth = require("../Controllers/AuthController");
const CustomerAuthenticationController= require("../Controllers/GoogleAuth");

const route = express.Router();
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const express_session = require('express-session')
const passport = require('passport')

const path = require('path')
const env = require("dotenv");

env.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
authUser = (request, accessToken, refreshToken,password, profile, done) => {
    return done(null, profile);
  }
console.log(authUser)
route.use(express_session({
    secret: "secret",
    resave: false,
    saveUninitialized: true 
}))
route.use(passport.initialize()) // init passport on every route call
route.use(passport.session())  
console.log(GOOGLE_CLIENT_ID)
//Use "GoogleStrategy" as the Authentication Strategy
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback   : true
  }, authUser));

  passport.serializeUser( (user, done) => { 
    console.log(`\n--------> Serialize User:`)
    console.log(user)
    done(null, user)
} )
passport.deserializeUser((user, done) => {
        console.log("\n--------- Deserialized User:")
        console.log(user)
        done (null, user)
}) 
checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
  }
route.post("/signup", auth.createUser);
route.post("/login",auth.Login)
route.get ('/google',CustomerAuthenticationController.Google_Auth_Welcome);
route.get ('/google/callback',CustomerAuthenticationController.Google_Auth_CallBack);
route.get ("/google/dashboard", checkAuthenticated, CustomerAuthenticationController.GoogleAuthSignIn);
route.post("/check_reset_password",CustomerAuthenticationController.reset_password_link)
route.post("/forgot_password",CustomerAuthenticationController.ForgotPassword)
route.put('/set_password',CustomerAuthenticationController.set_password)
route.post("/confirm_account",CustomerAuthenticationController.ConfirmAccount)
route.post('/check_confirm_account',CustomerAuthenticationController.confirm_link)
route.get("/get_cookie",auth.getUserDataFromCookie)
route.post("/get_user_data",CustomerAuthenticationController.findUserData_By_Token)




module.exports = route;