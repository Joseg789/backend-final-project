import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import router from "./api/api.router.js";
import dbConnection from "./config/db.js";
dotenv.config();
const app = express();
dbConnection();

app.use(
  cors({
    origin: "*", //permitimos todos los origenes de momento
  }),
);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// app.use(errorHandler); atajar errores

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API running → http://localhost:${PORT}`);
});

export default app;
