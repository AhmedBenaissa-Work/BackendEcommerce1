const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: "users", 
    required: true 
  },
  product_id: { 
    type: Schema.Types.ObjectId, 
    ref: "mining_products", 
    required: true 
  },
  timestamp: {
    type: Date, 
    default: Date.now 
  },
  amount: {

    type: Number, 
    required: true 
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'paypal', 'crypto',"google_payment"],  

  }
});
const Payment = mongoose.model("payments", PaymentSchema);
module.exports = Payment;
