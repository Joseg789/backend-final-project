import { Router } from "express";
import productApiController from "./api.controller.js";
import authController from "../controllers/authController.js";
import upload from "../middlewares/uploadCloudinaryMiddleware.js";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import orderController from "../controllers/orderController.js";
import contactController from "../controllers/contactController.js";
import subscriptionController from "../controllers/subscriptionController.js";

const router = Router();
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

router.get(
  "/products/category/:categoria",
  productApiController.getProductsByCategory,
);

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
  isAdmin,
  upload.single("imagen"),
  productApiController.createProduct,
);

router.post("/contact", contactController.sendMessage);
router.post("/subscribe", subscriptionController.subscribe);
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
  isAdmin,
  upload.single("imagen"),
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
router.delete(
  "/products/:id",
  auth,
  isAdmin,
  productApiController.deleteProduct,
);

// POST /api/auth/login
router.post("/auth/login", authController.login);

// POST /api/auth/register
router.post("/auth/register", authController.createUser);

// POST /api/auth/logout
router.post("/auth/logout", authController.logout);
// get /api/auth/users

router.get("/auth/users", auth, isAdmin, authController.getUsers);
router.put("/auth/users/:id", auth, isAdmin, authController.updateUser);
router.delete("/auth/users/:id", auth, isAdmin, authController.deleteUser);

//get /api/auth/me
router.get("/auth/me", authController.me);

//orders
// usuario logueado
router.get("/orders/me", auth, orderController.getMyOrders);
router.post("/orders", auth, orderController.createOrder);

// admin
//orders

router.get("/orders", auth, isAdmin, orderController.getAll);
router.put("/orders/:id", auth, isAdmin, orderController.updateStatus);
router.delete("/orders/:id", auth, isAdmin, orderController.deleteOrder);

export default router;
