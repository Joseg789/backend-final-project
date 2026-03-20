const express = require("express");
const router = express.Router();

const productApiController = require("./api.controller");
const authController = require("../controllers/authController");

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadCloudinaryMiddleware");

// GET /api/products
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Products API" });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/products", productApiController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/products/:id", productApiController.getProductById);

router.get(
  "/products/category/:categoria",
  productApiController.getProductsByCategory,
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear producto con imagen
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               talla:
 *                 type: string
 *               precio:
 *                 type: number
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       302:
 *         description: Producto creado
 */
router.post(
  "/products",
  auth,
  upload.single("image"),
  productApiController.createProduct,
);

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       302:
 *         description: Producto actualizado
 *       404:
 *         description: No encontrado
 */
router.put(
  "/products/:id",
  auth,
  upload.single("image"),
  productApiController.updateProduct,
);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */
router.delete("/products/:id", auth, productApiController.deleteProduct);

// POST /api/auth/login
router.post("/auth/login", authController.login);

// POST /api/auth/register
router.post("/auth/register", authController.createUser);

// POST /api/auth/logout (opcional JWT → normalmente frontend borra token)
router.post(
  "/auth/logout",
  authController.logout ??
    ((req, res) => {
      return res.json({ success: true, message: "Logout ok" });
    }),
);

module.exports = router;
