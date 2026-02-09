const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const multer = require('multer');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'replace_with_strong_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Make products.json accessible via helper
app.locals.productsFile = path.join(__dirname, 'products.json');

app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
