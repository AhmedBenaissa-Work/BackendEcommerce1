const env = require("dotenv");
env.config();
const stripe = require('stripe')(process.env.StripeApi);
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': process.env.paypal_mode, //sandbox or live
  'client_id': process.env.paypal_client_id,
  'client_secret': process.env.paypal_client_secret
});
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
  
}
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
  
module.exports={
    register_card,
    add_other_resources
    ,paypal_payment
}