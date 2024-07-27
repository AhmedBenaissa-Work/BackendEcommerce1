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
  }
});
const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;
