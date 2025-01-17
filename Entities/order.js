const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
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
  shipment_address: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  status : {
    type: String,
    enum: ['pending', 'paid', 'done']
  }
});
const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;
