const express = require("express");
const route = express.Router();
const PaymentController = require("../Controllers/paymentController")
route.post('/register_credit_card/',PaymentController.register_card)
route.post('/register_other_credit_card/',PaymentController.add_other_resources)
route.post('/paypal/success/:amount',PaymentController.paypal_payment)
module.exports=route