const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, '..', 'public', 'images') });

function readProducts(file) {
  return fs.readFile(file, 'utf8').then(JSON.parse);
}

function writeProducts(file, data) {
  return fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

function ensureAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.status(403).render('error', { message: 'Unauthorized: Admins only' });
  next();
}

router.get('/login', (req, res) => {
  res.render('login', { isAdmin: !!req.session.isAdmin, error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    req.session.isAdmin = true;
    return res.redirect('/');
  }
  res.render('login', { isAdmin: false, error: 'Invalid credentials' });
});

router.get('/logout', (req, res) => {
  req.session.isAdmin = false;
  res.redirect('/');
});

router.get('/add', ensureAdmin, (req, res) => {
  res.render('add-product', { isAdmin: true, error: null });
});

router.post('/add', ensureAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const products = await readProducts(req.app.locals.productsFile);
    const { title, price, description } = req.body;
    const id = Date.now().toString();
    const files = req.files || [];
    const images = files.map(f => path.posix.join('images', path.basename(f.path)));
    const primaryImage = images[0] || 'images/placeholder.svg';
    const secondary = images.slice(1);
    const product = { id, title, price: parseFloat(price) || 0, description, primaryImage, secondaryImages: secondary };
    products.push(product);
    await writeProducts(req.app.locals.productsFile, products);
    res.redirect('/');
  } catch (err) {
    res.render('add-product', { isAdmin: true, error: 'Failed to add product' });
  }
});

router.get('/edit/:id', ensureAdmin, async (req, res) => {
  const products = await readProducts(req.app.locals.productsFile);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).render('error', { message: 'Product not found' });
  res.render('edit-product', { product, isAdmin: true, error: null });
});

router.post('/edit/:id', ensureAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const products = await readProducts(req.app.locals.productsFile);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).render('error', { message: 'Product not found' });
    const { title, price, description } = req.body;
    product.title = title;
    product.price = parseFloat(price) || 0;
    product.description = description;
    const files = req.files || [];
    const images = files.map(f => path.posix.join('images', path.basename(f.path)));
    if (images.length) {
      // if new images uploaded, append to secondaryImages
      product.secondaryImages = (product.secondaryImages || []).concat(images);
      if (!product.primaryImage && images[0]) product.primaryImage = images[0];
    }
    await writeProducts(req.app.locals.productsFile, products);
    res.redirect(`/product/${product.id}`);
  } catch (err) {
    res.render('edit-product', { product: null, isAdmin: true, error: 'Failed to update' });
  }
});

// AJAX delete individual image from a product
router.delete('/product/:id/image', ensureAdmin, async (req, res) => {
  try {
    const { filename } = req.body;
    const filePath = path.join(__dirname, '..', 'public', filename);
    const products = await readProducts(req.app.locals.productsFile);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });
    // remove from primaryImage if matches
    if (product.primaryImage === filename) product.primaryImage = product.secondaryImages[0] || 'images/placeholder.svg';
    product.secondaryImages = (product.secondaryImages || []).filter(s => s !== filename);
    await writeProducts(req.app.locals.productsFile, products);
    // attempt to delete file (optional)
    try { await fs.unlink(filePath); } catch (e) { }
    res.json({ success: true, newPrimary: product.primaryImage });
  } catch (err) {
    res.json({ success: false });
  }
});

// AJAX set primary image
router.put('/product/:id/primary', ensureAdmin, async (req, res) => {
  try {
    const { filename } = req.body;
    const products = await readProducts(req.app.locals.productsFile);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });
    
    // Get all images
    const allImages = [product.primaryImage, ...(product.secondaryImages || [])];
    
    // Check if filename exists in allImages
    if (!allImages.includes(filename)) {
      return res.json({ success: false, message: 'Image not found' });
    }
    
    // Remove the new primary from secondary if it's there
    const newSecondary = allImages.filter(img => img !== filename);
    
    // Set the new primary
    product.primaryImage = filename;
    product.secondaryImages = newSecondary;
    
    await writeProducts(req.app.locals.productsFile, products);
    res.json({ success: true, primaryImage: product.primaryImage, secondaryImages: product.secondaryImages });
  } catch (err) {
    res.json({ success: false });
  }
});

// AJAX delete product
router.delete('/product/:id', ensureAdmin, async (req, res) => {
  try {
    const products = await readProducts(req.app.locals.productsFile);
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.json({ success: false });
    const prod = products[idx];
    // remove images (optional)
    const imgs = [prod.primaryImage].concat(prod.secondaryImages || []);
    for (const im of imgs) {
      try { await fs.unlink(path.join(__dirname, '..', 'public', im)); } catch (e) { }
    }
    products.splice(idx, 1);
    await writeProducts(req.app.locals.productsFile, products);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
