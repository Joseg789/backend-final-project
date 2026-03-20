const express = require("express");
const productController = require("../controllers/productController");

const app = express();
app.use(express.json());

// routes fake para testear el controlador sin necesidad de levantar el servidor completo
app.get("/products", productController.getAllProducts);
app.get("/products/:id", productController.getProductById);
app.post("/products", productController.createProductDashboard);
app.put("/products/:productId", productController.updateProductDashboard);
app.delete("/products/:productId", productController.deleteProductDashboard);

module.exports = app;
