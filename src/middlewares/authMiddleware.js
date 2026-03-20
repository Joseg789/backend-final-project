const auth = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect("/login");
  }
  return next();
};

module.exports = auth;
