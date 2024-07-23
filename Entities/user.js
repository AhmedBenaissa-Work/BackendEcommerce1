const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
      name:String,
      username:{ type: String, required: true, unique: true },
      email:{ type: String, required: true, unique: true },
      password:{ type: String, required: true},
      role:{
        type: String,
        enum: ['customer', 'seller', 'admin'],  
  
      }
})
const user=mongoose.model("user",userSchema);
module.exports=user;