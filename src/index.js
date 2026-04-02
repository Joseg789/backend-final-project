import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";
import router from "./api/api.router.js";
import dbConnection from "./config/db.js";

dotenv.config();

const app = express();

// Seguridad básica

const allowedOrigins = [
  "http://localhost:4000",
  "https://tu-frontend.com",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  session({
    secret: "mi_secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true solo en HTTPS
    },
  }),
);

//  limit para seguridad
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //  en 15 minutos
    max: 100, //max 100 peticiones
  }),
);

//  Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
