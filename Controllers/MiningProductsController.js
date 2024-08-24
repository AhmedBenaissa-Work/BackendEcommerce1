const mining_product = require("../Entities/mining_product")


const add_product = async (req,res)=>{
    const authToken = req.headers.authorization;
    const jwt = require('jsonwebtoken');

    const secretKey = ``; // Using this as a secret key
    const token1  = authToken // paste token here

    token_data=jwt.decode(token1,secretKey)
    if(token_data==undefined){
    res.send
    ({
      "code":400,
      "reason":"unauthorized"
    })}
    else{
    if(token_data.role=="admin"){
        console.log("it's admin")
        
       
        const mining_product_object = new mining_product({
            name:req.body.name,
            availability_in_stock:req.body.availability_in_stock,
            price:req.body.price,
            info:req.body.info,
            img:req.body.img
            
        })
        const product = await mining_product_object.save();
        res.json(product)
    }
    else{
        res.send
        ({
          "code":400,
          "reason":"unauthorized"
        })
    }
}
}
const update_product = async (req,res)=>{
    try{
    const authToken = req.headers.authorization;
    const jwt = require('jsonwebtoken');

    const secretKey = ``; // Using this as a secret key
    const token1  = authToken // paste token here
    
    token_data=jwt.decode(token1,secretKey)
    if(token_data==undefined){
      res.status(400).json({status: 400, message: "unauthorized"})
    }
    else{
    if(token_data.role=="admin"){
        console.log("it's admin")
         
        const filter={_id:req.params.id}
        const update={
          name:req.body.name,
          availability_in_stock:req.body.availability_in_stock,
          price:req.body.price,
          info:req.body.info}
        const output=await mining_product.findOne(filter)
        if(output){
        await mining_product.findOneAndUpdate(filter, update); 

        res.json("updated")
        }
        else{
          
          res.status(400).json({status: 400, message: "product not found in our records"})
        }
    }
    else{
      res.status(400).json({status: 400, message: "unauthorized"})
    }
}}catch(error){
  console.log(error.message)
  res.status(400).json({status: 400, message: error.message})
}
}
const remove_product = async (req,res)=>{
  const authToken = req.headers.authorization;
  const jwt = require('jsonwebtoken');

  const secretKey = ``; // Using this as a secret key
  const token1  = authToken // paste token here
  
  token_data=jwt.decode(token1,secretKey)
  if(token_data==undefined){
  res.send
  ({
    "code":400,
    "reason":"unauthorized"
  })}
  else{
  if(token_data.role=="admin"){
      console.log("it's admin")
      try{
      pr=await mining_product.find({_id:req.params.id})
      console.log(pr)
      if(pr.length>0){
      const doc = await mining_product.findByIdAndDelete(req.params.id); 
      res.json("deleted")
      }else{
        console.log("dfsfqsdffq")
        res.json("product not found in our records")
      }
    }catch(error){
      res.status(400).json({status: 400, message: error.message})
      }
  }
  else{
      res.send
      ({
        "code":400,
        "reason":"unauthorized"
      })
  }
}
}
const get_product_by_id = async (req,res)=>{
  try{
    const authToken = req.headers.authorization;
    const jwt = require('jsonwebtoken');
    console.log(req.params.id)
    const secretKey = ``; // Using this as a secret key
    const token1  = authToken // paste token here

    token_data=jwt.decode(token1,secretKey)
    if(token_data==undefined){
    res.send
    ({
      "code":400,
      "reason":"unauthorized"
    })}
    else{
    if(token_data.role=="admin" || token_data.role=="customer"){
        console.log("it's admin")
        const doc = await mining_product.find({_id:req.params.id}); 
        res.json(doc)
    }
    else{
        res.send
        ({
          "code":400,
          "reason":"unauthorized"
        })
    }
}}catch(error){
  res.status(400).json({status: 400, message: error.message})
}
}
const get_all_products = async (req,res)=>{
  try{
  const authToken = req.headers.authorization;
  
  const jwt = require('jsonwebtoken');

  const secretKey = ``; // Using this as a secret key
  const token1  = authToken // paste token here

  token_data=jwt.decode(token1,secretKey)
  if(token_data==undefined){
  res.send
  ({
    "code":400,
    "reason":"unauthorized"
  })}
  else{
  if(token_data.role=="admin" || token_data.role=="customer"){
      console.log("it's ",token_data.role)
    

      const docs = await mining_product.find({}); 
      res.json(docs)
  }
  else{
      res.send
      ({
        "code":400,
        "reason":"unauthorized"
      })
  }
}
}
catch(e){
  console.log("error:",e.message)
  
}
}
const decrease_on_order = async (req,res)=>{
  //when customer orders a product availability of product in stock decreases
  const authToken = req.headers.authorization;
  const jwt = require('jsonwebtoken');

  const secretKey = ``; // Using this as a secret key
  const token1  = authToken // paste token here

  token_data=jwt.decode(token1,secretKey)
  if(token_data==undefined){
  res.send
  ({
    "code":400,
    "reason":"unauthorized"
  })}
  else{
  if(token_data.role=="customer"){
      const doc = await mining_product.find({_id:req.params.id});
      const filter={_id:req.params.id}
        const update={
          availability_in_stock:doc[0].availability_in_stock-req.body.quantity,
        }
      console.log(doc)
      const output=await mining_product.findOne(filter)
      if(output){
      await mining_product.findOneAndUpdate(filter, update); 

      res.json("updated")
      }
      
      
  }
  else{
      res.send
      ({
        "code":400,
        "reason":"unauthorized"
      })
  }
}
}
module.exports={
    add_product,
    update_product,
    get_product_by_id,
    decrease_on_order,
    get_all_products,
    remove_product
}










