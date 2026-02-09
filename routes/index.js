const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

function readProducts(file) {
  return fs.readFile(file, 'utf8').then(JSON.parse);
}

function writeProducts(file, data) {
  return fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

router.get('/', async (req, res) => {
  const products = await readProducts(req.app.locals.productsFile);
  res.render('home', { products, isAdmin: !!req.session.isAdmin });
});

router.get('/product/:id', async (req, res) => {
  const products = await readProducts(req.app.locals.productsFile);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).render('error', { message: 'Product not found' });
  res.render('product-details', { product, isAdmin: !!req.session.isAdmin });
});

router.post('/cart/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const products = await readProducts(req.app.locals.productsFile);
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(400).render('error', { message: 'Invalid product' });

  if (!req.session.cart) req.session.cart = {};
  const qty = Math.max(1, parseInt(quantity || '1', 10));
  if (req.session.cart[productId]) req.session.cart[productId] += qty;
  else req.session.cart[productId] = qty;

  res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
  const products = await readProducts(req.app.locals.productsFile);
  const cart = req.session.cart || {};
  const items = Object.keys(cart).map(id => {
    const p = products.find(x => x.id === id);
    return {
      id,
      title: p ? p.title : 'Unknown',
      price: p ? p.price : 0,
      qty: cart[id] || 0,
      primaryImage: p ? p.primaryImage : 'images/placeholder.svg'
    };
  });
  const grossTotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  res.render('cart', { items, grossTotal, isAdmin: !!req.session.isAdmin });
});

router.delete('/cart/remove', (req, res) => {
  const { id } = req.body;
  if (!req.session.cart) return res.json({ success: false });
  delete req.session.cart[id];
  res.json({ success: true });
});

module.exports = router;
