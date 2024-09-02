
const order = require("../Entities/order")
const place_order = async(req,res)=>{

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
        if(token_data.role=="customer" ){
            const order_obj = new order({
                user_id:token_data.id,
                product_id:req.body.product_id,
                shipment_address:req.body.shipment_address,
                quantity:req.body.quantity, 
                status : "pending"           
            })
            const order_1 = await order_obj.save();
            res.json(order_1)
        }
        else{
            res.send
            ({
              "code":400,
              "reason":"unauthorized"
            })
        }}
  
}
const cancel_order = async(req,res)=>{

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
      if(token_data.role=="customer" ){
        const doc = await order.findByIdAndDelete(req.params.id); 
          res.json(doc)
      }
      else{
          res.send
          ({
            "code":400,
            "reason":"unauthorized"
          })
      }}

}
const view_orders = async(req,res)=>{

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
        if(token_data.role=="customer" ){
            
            const orders = await order.find({'user_id':token_data.id});
            res.json(orders)
        }
        else{
            res.send
            ({
              "code":400,
              "reason":"unauthorized"
            })
        }}
  
}
module.exports={
    place_order,view_orders,cancel_order
}