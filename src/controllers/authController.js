import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

const authController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
      return res.json({
        success: true,
        user: { email: newUser.email, id: newUser._id },
      });
    } catch (error) {
      if (error.code === 11000)
        return res.status(400).json({ message: "El email ya está registrado" });
      return res.status(500).json({ message: "Error al crear usuario" });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      return res.json(users);
    } catch {
      return res.status(500).json({ message: "Error al obtener usuarios" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    try {
      // admin
      if (email === process.env.ADMIN_USER) {
        const isAdmin = await bcrypt.compare(
          password,
          process.env.ADMIN_PASSWORD_HASH,
        );
        if (!isAdmin)
          return res.status(401).json({ message: "Credenciales incorrectas" });

        const token = generateToken({ email, role: "admin" });
        return res.json({
          success: true,
          token,
          user: { email, role: "admin" },
        });
      }

      // usuario
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Credenciales incorrectas" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Credenciales incorrectas" });

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: "user",
      });

      return res.json({
        success: true,
        token,
        user: { email: user.email, id: user._id, role: "user" },
      });
    } catch (error) {
      return res.status(500).json({ message: "Error en Login" });
    }
  },

  // con JWT el logout es solo del lado cliente
  logout: (req, res) => {
    return res.json({ success: true, message: "Logout correcto" });
  },

  me: (req, res) => {
    // req.user viene del middleware auth
    return res.json({ user: req.user });
  },

  updateUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const updates = {};
      if (email) updates.email = email;
      if (password) updates.password = await bcrypt.hash(password, 10);
      const user = await User.findByIdAndUpdate(req.params.id, updates, {
        returnDocument: "after",
      }).select("-password");
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      return res.json({ success: true, user });
    } catch (error) {
      if (error.code === 11000)
        return res.status(400).json({ message: "El email ya está registrado" });
      return res.status(500).json({ message: "Error al actualizar usuario" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Error al eliminar usuario" });
    }
  },
};

export default authController;
