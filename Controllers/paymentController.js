const env = require("dotenv");
env.config();
const stripe = require('stripe')(process.env.StripeApi);
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': process.env.paypal_mode, //sandbox or live
  'client_id': process.env.paypal_client_id,
  'client_secret': process.env.paypal_client_secret
});
const{ Web3 }= require('web3');
const Payment = require("../Entities/Payment");
const web3 = new Web3("http://127.0.0.1:8545")
const register_card=async(req,res)=>{
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: req.body.number,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvc: req.body.cvc,
      },
    });
    console.log(paymentMethod)
    const customer = await stripe.customers.create({
      description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
      name:req.body.cus_name,
      email:req.body.cus_email
    });
    console.log(customer)
    const paymentMethod2 = await stripe.paymentMethods.attach(
      paymentMethod.id,
      {customer: customer.id}
    );
    res.send(paymentMethod2)
  
  }
const confirm_card_payment = async(req,res)=>{
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
    console.log(token_data)
  const stripe_customer =  await stripe.customers.search({
    query: 'email:\''+ token_data.email +'\'',
  });
  console.log(stripe_customer.data)
  if(stripe_customer.data.length==0){
    const customer = await stripe.customers.create({
      description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
      name:req.body.cus_name,
      email:token_data.email
    });
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: req.body.number,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvc: req.body.cvc,
      }})
    console.log(paymentMethod)
   // console.log(paymentMethod.data)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethod.id,
      customer:customer.id,
      confirm:true
    });
    console.log(paymentIntent)
    res.json(paymentIntent)
  }
  else{
  console.log(stripe_customer.data[0].id)
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: req.body.number,
      exp_month: req.body.exp_month,
      exp_year: req.body.exp_year,
      cvc: req.body.cvc,
    }})
  console.log(paymentMethod)
  console.log(paymentMethod.data)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method: paymentMethod.id,
    customer:stripe_customer.data[0].id,
    confirm:true
  });
  console.log(paymentIntent)
  res.json({"payment_confirm":paymentIntent,"paymentMethod":paymentMethod.card})
}}}

const add_other_resources = async (req,res)=>{
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: req.body.number,
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
          cvc: req.body.cvc,
        },
      });
      console.log(paymentMethod)   
      const paymentMethod2 = await stripe.paymentMethods.attach(
        paymentMethod.id,
        {customer: req.body.customer_id}
      );
      res.send(paymentMethod2)
}
const paypal_payment=async (req,res)=>{

    console.log(req.params.amount)
    const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
    console.log(payerId)
      const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.params.amount
            }
        }]
      };
       
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            ;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
    }
    const crypto_transaction = async (req, res) => {
      const { sender, receiver, amount } = req.body;
    
      if (!sender || !receiver || !amount) {
        return res.status(400).send('Sender address, receiver address, and amount are required.');
      }
    
      try {
        
    
     
     accounts=await web3.eth.getAccounts( (err,docs)=>{

      if(err) console.log(err)
      if(docs) console.log("docs",docs)
    });
  
        
        //web3.eth.accounts.wallet.add(account);
        const nonce = await web3.eth.getTransactionCount(sender, 'latest');
        console.log(nonce)
    
        const transaction = {
          from: sender,
          to: receiver,
          value: web3.utils.toWei(amount.toString(), 'ether'),
          gas: 21000,
          gasPrice: web3.utils.toWei('10', 'gwei'),
          nonce: nonce,
        };
        console.log(web3.eth.accounts.wallet.entries.toString())
       
        r=await web3.eth.sendTransaction(transaction)
       
        res.status(200).send(`Transaction successful with hash: `+r.transactionHash);
      } catch (error) {
        console.log(error)
        res.status(400).send(`Transaction failed: ${error.message}`);
      }
    }

const save_payment_record = async(req,res)=>{
        
        const authToken = req.headers.authorization;
        const jwt = require('jsonwebtoken');
        const secretKey = ``; // Using this as a secret key
        const token1  = authToken // paste token here
        token_data=jwt.decode(token1,secretKey)
        if(token_data.id==undefined)
        {
          res.status(400).send(`Transaction Unauthorized`);
        }
        else
        {
          const payment_obj = new Payment({
            user_id:token_data.id,
            product_id:req.body.product_id,
            amount:req.body.amount,
            payment_method:req.body.method                
        })
        const payment = await payment_obj.save();
        res.json(payment)
        }
    }    
  
module.exports={
    register_card,
    add_other_resources
    ,paypal_payment
    ,confirm_card_payment,
    crypto_transaction,
    save_payment_record
}

