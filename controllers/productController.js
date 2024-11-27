const fs = require('fs-extra');
const path = './data/products.json';

async function getAllProducts(req, res) {
    const products = await fs.readJson(path);
    res.json(products);
}

async function getProductById(req, res) {
    const id = req.params.id;
    const products = await fs.readJson(path);
    const product = products.find(p => p.id == id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
}

async function createProduct(req, res) {
    const newProduct = req.body;
    const products = await fs.readJson(path);
    newProduct.id = products.length + 1;  
    products.push(newProduct);
    await fs.writeJson(path, products);
    res.status(201).json(newProduct);
}

async function updateProduct(req, res) {
    const id = req.params.id;
    const updatedProduct = req.body;
    const products = await fs.readJson(path);
    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex === -1) return res.status(404).send('Product not found');
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    await fs.writeJson(path, products);
    res.json(products[productIndex]);
}

async function deleteProduct(req, res) {
    const id = req.params.id;
    const products = await fs.readJson(path);
    const newProducts = products.filter(p => p.id != id);
    if (newProducts.length === products.length) return res.status(404).send('Product not found');
    await fs.writeJson(path, newProducts);
    res.status(204).send();
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
