import User from "../models/User.js";
import bcrypt from "bcrypt";

const authController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;

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
      return res.status(500).json({ message: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // admin
      if (
        email === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD
      ) {
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
      // if (password !== user.password) {
      //   return res.status(401).json({ message: "Credenciales incorrectas" });
      // }

      return res.json({
        success: true,
        user: {
          email: user.email,
          id: user._id,
          role: "user",
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error en login" });
    }
  },

  logout: (req, res) => {
    return res.json({ success: true, message: "Logout correcto" });
  },
};

export default authController;
