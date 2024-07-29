const express = require("express");
const route = express.Router();
const PaymentController = require("../Controllers/paymentController")
route.post('/register_credit_card/',PaymentController.register_card)
route.post('/register_other_credit_card/',PaymentController.add_other_resources)
route.post('/paypal/success/:amount',PaymentController.paypal_payment)
route.post('/confirm_credit_card_payment',PaymentController.confirm_card_payment)
route.post("/crypto_transaction",PaymentController.crypto_transaction)
module.exports=route