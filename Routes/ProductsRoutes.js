const ProductController = require("../Controllers/MiningProductsController")
const express = require("express");
const route = express.Router();
route.post("/add",ProductController.add_product)
route.put("/update/:id",ProductController.update_product)
route.post("/",ProductController.get_all_products)
route.post("/:id",ProductController.get_product_by_id)
route.delete("/remove/:id",ProductController.remove_product)
route.post("/decrease/:id",ProductController.decrease_on_order)

module.exports=route