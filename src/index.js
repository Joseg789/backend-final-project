import express from "express";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";
import router from "./api/api.router.js";
import dbConnection from "./config/db.js";
import morgan from "morgan";
import MongoStore from "connect-mongo";

const app = express();

// Seguridad básica

const allowedOrigins = ["https://tu-frontend.com", "http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
//  limit para seguridad
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //  en 15 minutos
    max: 2000, //max 2000 peticiones
  }),
);
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), //guardamos la session en mongodb
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  }),
);

//  Body parsing
app.use(express.json({ limit: "10mb" })); // si envio muchos items en el carrito  le doy mas espacio para que pueda parsearlos
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rutas
app.use("/api", router);

//  404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//  Error handler global
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

//  Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      console.log(` API running → http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
