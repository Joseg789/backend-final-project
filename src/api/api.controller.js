const Product = require("../models/Product");
const validateErrors = require("../utils/validateErrors");

const productController = {
  // GET /api/products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Products not found",
        });
      }

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // GET /api/products/:id
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // POST /api/products
  createProduct: async (req, res) => {
    try {
      const errors = validateErrors(req);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const { nombre, descripcion, categoria, talla, precio } = req.body;

      const newProduct = await Product.create({
        nombre,
        descripcion,
        imagen: req.file ? req.file.path : undefined,
        categoria,
        talla,
        precio,
      });

      res.status(201).json({
        success: true,
        data: newProduct,
      });
    } catch (error) {
      console.error(error.message);

      if (error.name === "ValidationError") {
        const erroresArray = Object.values(error.errors).map((e) => e.message);

        return res.status(400).json({
          success: false,
          errors: erroresArray,
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // PUT /api/products/:id
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, categoria, talla, precio } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          nombre,
          descripcion,
          imagen: req.file ? req.file.path : undefined,
          categoria,
          talla,
          precio,
        },
        { new: true },
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // DELETE /api/products/:id
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // GET /api/products/category/:categoria
  getProductsByCategory: async (req, res) => {
    try {
      let { categoria } = req.params;
      categoria = categoria[0].toUpperCase() + categoria.slice(1);

      const products = await Product.find({ categoria });

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = productController;
