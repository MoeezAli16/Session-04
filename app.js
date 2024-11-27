const express = require('express');
const app = express();
const fs = require('fs-extra');
const productRoutes = require('./routes/products');
const logger = require('./middlewares/logger');
const validateProduct = require('./middlewares/validate');

app.use(express.json()); 
app.use(logger);          

app.use('/products', productRoutes);
app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on port 3000'));
