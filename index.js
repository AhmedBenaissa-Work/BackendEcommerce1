const express= require("express");
const Connection=require("./db");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const env = require("dotenv");

env.config();
const PORT=process.env.PORT
Connection();

app.use(express.json())
const AuthRoutes=require('./Routes/AuthRoutes')
const ProductRoutes=require("./Routes/ProductsRoutes")
const PaymentRoutes=require("./Routes/PaymentRoutes")
app.use("/auth",AuthRoutes)
app.use("/products",ProductRoutes)
app.use("/payment",PaymentRoutes)
app.listen(PORT, () => {
     console.log(`server is running at port ${PORT}`);
});