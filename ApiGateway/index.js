const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
/*******************************************E-commerce Features is Up running on  MongoDB Databas*********************************************************/
app.use('/auth/', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }));
app.use('/payment/*', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }));
app.use('/orders/*', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }));
app.use('/products/*', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }));
/*************************************************CryptoCurrency Data runs on flask Server****************************************************/
app.use('/exchange/', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));
app.listen(8008);