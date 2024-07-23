const User = require("../Entities/user");


const bcrypt = require("bcrypt");

const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const createUser = async (req, res) => {
  try {
    if (
      !(
        req.body.email &&
        req.body.password &&
        req.body.name &&
        req.body.username &&
        req.body.role
      )
    ) {
      res.status(400).send("All input is required");
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(req.body.email);
    if(isValid==true){
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,

      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role:req.body.role
    });
    const user = await newUser.save();
    res.json(user)
  }else{res.json("error email  has to be like  xxxx@ff.com")}}
   catch (error) {
    console.log("Got an error", error);

  }
};
const Login= async (req, res) =>{
  try{
   const credentials = {
    email: req.body.email,
    password: req.body.password,    
   }
   const salt = 10;
   const hashedPassword = await bcrypt.hash(credentials.password, salt);
   const user = await User.findOne({ email: credentials.email  });
   console.log(user)
   if( bcrypt.compareSync(req.body.password, user.password)==true)
    {
   const secret = generateSecret()
   const jwt = require("jsonwebtoken");
   const token = jwt.sign({
        id: user.id,
        role: user.role,
        email: user.email,
         // Note: It's generally not safe to include passwords in JWT tokens
      }, secret, { expiresIn: '1h' });

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
    res.json("password incorrect")
  }
  }catch(error){
    res.json(error)
  }
}

const getUserDataFromCookie = (req, res, next) => {
    const userDataCookie = req.cookies;
    console.log(req.cookies)
    res.send(userDataCookie)
  };


module.exports={
    createUser,
    getUserDataFromCookie
    ,Login,getUserDataFromCookie
   }