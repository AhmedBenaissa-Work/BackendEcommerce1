const express = require("express");
const route = express.Router();
const OrderController = require("../Controllers/OrdersController")
route.post('/place_order',OrderController.place_order)
module.exports=route