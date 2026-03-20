import User from "../models/User.js";

const authController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const newUser = await User.create({ email, password });
      if (!newUser) {
        return res.status(500).send("error creando el usuario");
      }
      return res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  },
  //post/login
  login: async (req, res) => {
    const { email, password } = req.body;

    //verificar si es admin
    if (
      email === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASSWORD
    ) {
      req.session.isLogged = true;
      req.session.isAdmin = true;
      return; //ver
    }
    const user = await User.findOne({ email });
    if (!user) {
      req.session.isLogged = false;
      return res.status(401).send("usuario  o clave incorrecto");
    }
    //verificamos password
    if (user.password !== password) {
      req.session.isLogged = false;

      return res.status(401).send("usuario malo");
    }
    //inicia sesion usuario
    req.session.isLogged = true;
    req.session.isAdmin = false;
    req.user = user.email;

    return; //ver
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error al cerrar sesión");
      }

      return res.redirect("/login"); //ver
    });
  },
};

export default authController;
