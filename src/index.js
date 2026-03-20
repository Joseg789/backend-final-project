const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./api/api.router");

dotenv.config();

const app = express();

const { dbConnection } = require("./config/db");

app.use(
  cors({
    origin: "*", //permitimos todos los origenes de momento
  }),
);
app.use(helmet());

dbConnection();

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

module.exports = app;
