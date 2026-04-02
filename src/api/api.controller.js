import Products from "../models/Products.js";
import validateErrors from "../utils/validateErrors.js";
import mongoose from "mongoose";

const productController = {
  // GET /api/products
  getAllProducts: async (req, res) => {
    try {
      const products = await Products.find().lean();

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // GET /api/products/:id
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      // ✅ Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      const product = await Products.findById(id).lean();

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
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

      const { nombre, descripcion, categoria, talla, precio, genero, imagen } =
        req.body;

      const newProduct = await Products.create({
        nombre,
        descripcion,
        categoria,
        talla,
        precio,
        genero,
        imagen: req.file ? req.file.path : imagen,
      });

      return res.status(201).json({
        success: true,
        data: newProduct,
      });
    } catch (error) {
      console.error(error);

      if (error.name === "ValidationError") {
        const erroresArray = Object.values(error.errors).map((e) => e.message);

        return res.status(400).json({
          success: false,
          errors: erroresArray,
        });
      }

      return res.status(500).json({
        success: false,
        message: " Server Error",
      });
    }
  },

  // PUT /api/products/:id
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;

      // ✅ Validar ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      const errors = validateErrors(req);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const updateData = {
        ...req.body,
      };

      // ✅ Manejo de imagen opcional
      if (req.file) {
        updateData.imagen = req.file.path;
      }

      const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // DELETE /api/products/:id
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      // ✅ Validar ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      const deletedProduct = await Products.findByIdAndDelete(id).lean();

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // GET /api/products/category/:categoria
  getProductsByCategory: async (req, res) => {
    try {
      let { categoria } = req.params;

      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);

      const products = await Products.find({ categoria }).lean();

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

export default productController;
