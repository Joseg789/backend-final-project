import User from "../models/User.js";
import bcrypt from "bcrypt";

const authController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      return res.json({
        success: true,
        user: {
          email: newUser.email,
          id: newUser._id,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      return res.status(500).json({ message: "Error al crear usuario" });
    }
  },
  getUsers: async (req, res) => {
    try {
      //excluimos la contraseña
      const users = await User.find().select("-password");
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener usuarios" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    try {
      // admin
      if (email === process.env.ADMIN_USER) {
        const isAdmin = await bcrypt.compare(
          password,
          process.env.ADMIN_PASSWORD_HASH,
        );
        if (!isAdmin) {
          return res.status(401).json({ message: "Credenciales incorrectas" });
        }
        req.session.user = { email, role: "admin" };
        return res.json({ success: true, role: "admin" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      req.session.user = { email: user.email, id: user._id, role: "user" }; // guardar en sesión
      return res.json({ success: true, user: req.session.user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error en login" });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.clearCookie("connect.sid"); // limpiar la cookie
      return res.json({ success: true, message: "Logout correcto" });
    });
  },
  me: (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "No hay sesión activa" });
    }
    return res.json({ user: req.session.user });
  },
};

export default authController;
