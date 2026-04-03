// middlewares/auth.js
export const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};

export default auth;
