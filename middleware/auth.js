function ensureAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(403).render('error', { message: 'Unauthorized: Admins only' });
  }
  next();
}

module.exports = { ensureAdmin };
