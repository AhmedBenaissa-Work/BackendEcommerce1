const mongoose=require("mongoose");

const MiningProductSchema= new mongoose.Schema({
      name:String,
      availability_in_stock:{ type: Number, required: true, },
      price:{ type: Number, required: true },
      info:{
        type: String,  
      },
      img:String
})
const mining_product=mongoose.model("mining_product",MiningProductSchema);
module.exports=mining_product;