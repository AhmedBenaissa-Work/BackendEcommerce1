

const bcrypt=require('bcryptjs')
const CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const users=require("../Entities/user")
const passport = require('passport')
const crypto = require('crypto');
const nodemailer = require("nodemailer")
const env = require("dotenv");
env.config();

const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
  };

const Google_Auth_Welcome = passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
)
const Google_Auth_CallBack = passport.authenticate( 'google', {
    successRedirect: '/auth/google/dashboard',
    failureRedirect: '/login'
})
const GoogleAuthSignIn = async (req, res) => {
    try{
        console.log("email=====================",req.user.email)
        Email=req.user.email
        const salt = 10;
        const hashedPassword = await bcrypt.hash("123456789Azsdqdaz@azaeza", salt);
        user= await users.findOne({email:Email})
        console.log(user)
        if(user){
            console.log("exists")
            const secret = generateSecret()
           const jwt = require("jsonwebtoken");
           const token = jwt.sign({
           id: user._id,
           role: user.role,
           email: user.email,
       
      }, secret, { expiresIn: '1h' });
    console.log(token)
    res.cookie("token", token, {
      path: "/", // Cookie is accessible from all paths
      expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
      secure: true, // Cookie will only be sent over HTTPS
      httpOnly: true, // Cookie cannot be accessed via client-side scripts
      sameSite: "None",
      token:token
    });
    console.log(res)


    console.log("cookie set succesfully");

    res.json(user);
        }
        else{
            user=await users.create({
                name:req.user.given_name+req.user.family_name,
                username:req.user.displayName,
                email:req.user.email,
                password:hashedPassword, 
                role:"customer" //fornow
                
            })
           res.send(user)
        }
          
    }
    
    catch(error){
        res.json("error")
   }

}
const ConfirmAccount = async(req,res) => {

    try{
            const email=req.body.email
            user=await users.findOne({email:email}) 
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.Mailing_App_Email,
                  pass: process.env.Mailing_App_Password
                }
              });
              var hash = CryptoJS.SHA256(req.params.email+user.password)
              let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
              let data = {
                  time: Date(),
                  Email:email
              }
              let  init_time=new Date(Date.now())
              let  auth_token_expire=new Date(Date.now()+(0.01)*3600000)
              const auth_token = jwt.sign(data, jwtSecretKey);
              console.log(auth_token)
              console.log("expire=>"+auth_token_expire)
              let link =  'http://localhost:8000/auth/check_confirm_account'
              var mailOptions = {
                from: 'baissahmed@gmail.com',
                to: email,
                subject: "Forgot Password",
                text: '<a href="'+link+'"></a>',
                html:'<h1>Click on the link Below 👇</h1>'+
                
                '<p style="color:red ; font-family:verdana;">'+"this link expires in 10 minutes"+'</p>'+
                ' <form  action="'+link+'"'+ 'method="POST" > '+
                ' <input type="text" value="'+email+'"' +'id="email" name="email"  style="display:none"> '+
                ' <input type="text" value="'+auth_token+'"' +'id="auth_token" name="auth_token"  style="display:none"> '+
                ' <input  value="'+auth_token_expire+'"' +'id="auth_token_expire" name="auth_token_expire"  style="display:none"> '+ 
                ' <input  type="submit" value="Submit">'+
                '</form>'
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  res.send('Email sent: ' + info.response);
                }
            })


    }catch(error){
        res.status(400).json({status: 400, message: error.message})
    }
}
const ForgotPassword = async(req,res) => {

    try{
            const email=req.body.email
            user=await users.findOne({email:email}) 
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.Mailing_App_Email,
                  pass: process.env.Mailing_App_Password
                }
              });
              var hash = CryptoJS.SHA256(req.params.email+user.password)
              let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
              let data = {
                  time: Date(),
                  Email:email
              }
              let  init_time=new Date(Date.now())
              let  auth_token_expire=new Date(Date.now()+(0.01)*3600000)
              const auth_token = jwt.sign(data, jwtSecretKey);
              console.log(auth_token)
              console.log("expire=>"+auth_token_expire)
              let link =  'http://localhost:8000/auth/check_reset_password'
              var mailOptions = {
                from: 'baissahmed@gmail.com',
                to: email,
                subject: "Forgot Password",
                text: '<a href="'+link+'"></a>',
                html:'<h1>Click on the link Below 👇</h1>'+
                
                '<p style="color:red ; font-family:verdana;">'+"this link expires in 10 minutes"+'</p>'+
                ' <form  action="'+link+'"'+ 'method="POST" > '+
                ' <input type="text" value="'+email+'"' +'id="email" name="email"  style="display:none"> '+
                ' <input type="text" value="'+auth_token+'"' +'id="auth_token" name="auth_token"  style="display:none"> '+
                ' <input  value="'+auth_token_expire+'"' +'id="auth_token_expire" name="auth_token_expire"  style="display:none"> '+ 
                ' <input  type="submit" value="Submit">'+
                '</form>'
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  res.send('Email sent: ' + info.response);
                }
            })


    }catch(error){
        res.status(400).json({status: 400, message: error.message})
    }
}
const confirm_link=async(req,res)=>{

        console.log(req.body)
        const random = Math.floor(Math.random() * 9000 + 1000);
        var hash = CryptoJS.SHA256(req.body.email+random)
        let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);       
        let data = {
            time: Date(),
            email:req.body.email,
            id:random
        }
        const token = jwt.sign(data, jwtSecretKey);
        console.log(token)
        let  init_time=new Date(Date.now())
        console.log("init=>"+init_time)
        console.log("expire="+req.body.auth_token)
        console.log("expiredate="+req.body.auth_token_expire)
        if(init_time.getTime()>new Date(req.body.auth_token_expire).getTime()){
            res.send("token expired")
        }
        else {
            let link='http://localhost:3000/confirm?q='+token 
            res.redirect(link)       
        
        }
    };
    const findUserData_By_Token=async(req,res)=>{
    try{
    const authToken = req.headers.authorization;
    const jwt = require('jsonwebtoken');

    const secretKey = ``; // Using this as a secret key
    const token1  = authToken // paste token here
    decoded=jwt.decode(token1,secretKey)
    console.log(decoded)
    user=await users.findOne({email:decoded.Email})
    res.json(user)
    }
    catch(error){
        console.log(error)
    }
    }
    const reset_password_link=async(req,res)=>{

        console.log(req.body)
        const random = Math.floor(Math.random() * 9000 + 1000);
        var hash = CryptoJS.SHA256(req.body.email+random)
        let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);       
        let data = {
            time: Date(),
            email:req.body.email,
            id:random
        }
        const token = jwt.sign(data, jwtSecretKey);
        console.log(token)
        let  init_time=new Date(Date.now())
        console.log("init=>"+init_time)
        console.log("expire="+req.body.auth_token)
        console.log("expiredate="+req.body.auth_token_expire)
        if(init_time.getTime()>new Date(req.body.auth_token_expire).getTime()){
            res.send("token expired")
        }
        else {
            let link='http://localhost:3000/reset_password?q='+token 
            res.redirect(link)       
        
        }
    };
const set_password = async(req,res)=>{
    try{
        const authToken = req.headers.authorization;
        const jwt = require('jsonwebtoken');
    
        const secretKey = ``; 
        const token1  = authToken 
    
        token_data=jwt.decode(token1,secretKey)
        console.log(token1)
        if(token_data==undefined){
        res.send
        ({
          "code":400,
          "reason":"unauthorized"
        })}
        else{
            //user=await users.findOne({email:token_data.Email})
            const salt = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const filter={email:token_data.email}
            const update={
              password : hashedPassword
            }
            const output=await users.findOne(filter)
            if(output){
            await users.findOneAndUpdate(filter, update); 
    
            res.json("Password Updated")
            }
            else{
              
              res.status(400).json({status: 400, message: "User not found in our records"})
            }

        }

    }catch(error){
        res.status(400).json({status: 400, message: error.message})
    }
}

module.exports={
    GoogleAuthSignIn,
    Google_Auth_Welcome,
    Google_Auth_CallBack,
    ForgotPassword,
    reset_password_link,
    set_password,ConfirmAccount,confirm_link,findUserData_By_Token
}