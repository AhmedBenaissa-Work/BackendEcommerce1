const express = require("express");
const route = express.Router();
const OrderController = require("../Controllers/OrdersController")
route.post('/place_order',OrderController.place_order)
route.post('/view_orders',OrderController.view_orders)
module.exports=route