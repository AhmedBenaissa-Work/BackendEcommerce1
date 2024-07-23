token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWE1NWY0NjE1ZjgzODUyMGNjZTJkYiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiWG9oblhSUm9lMzFAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjEzOTA2MDEsImV4cCI6MTcyMTM5NDIwMX0.OP6jqbJC7IJc8886-w7_A9yeKXf4eGwI1KP_3RuWqh8"
const controller=require("./MiningProductsController")
const jwt = require('jsonwebtoken');

const secretKey = ``; // Using this as a secret key
const token1  = token // paste token here

console.log(jwt.decode(token1,secretKey)); 
controller.get_all_products()