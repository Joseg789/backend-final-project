const request = require("supertest");

jest.mock("../models/Product");
jest.mock("../utils/validateErrors");

const Product = require("../models/Product");
const validateErrors = require("../utils/validateErrors");
const app = require("./app");

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /products", () => {
    it("should return products", async () => {
      Product.find.mockResolvedValue([{ _id: "1", nombre: "Producto 1" }]);

      const res = await request(app).get("/products");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(Product.find).toHaveBeenCalled();
    });

    it("should return alert if empty", async () => {
      Product.find.mockResolvedValue([]);

      const res = await request(app).get("/products");

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /products/:id", () => {
    it("should return product by id", async () => {
      Product.findById.mockResolvedValue({ _id: "1", nombre: "Test" });

      const res = await request(app).get("/products/1");

      expect(res.statusCode).toBe(200);
      expect(res.body.nombre).toBe("Test");
    });

    it("should return 404 if not found", async () => {
      Product.findById.mockResolvedValue(null);

      const res = await request(app).get("/products/1");

      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /products", () => {
    it("should create product", async () => {
      validateErrors.mockReturnValue([]);

      Product.create.mockResolvedValue({
        _id: "1",
        nombre: "Nuevo",
      });

      const res = await request(app).post("/products").send({
        nombre: "Nuevo",
        descripcion: "desc",
        categoria: "Ropa",
        talla: "M",
        precio: 10,
      });

      expect(Product.create).toHaveBeenCalled();
      expect(res.statusCode).toBe(302);
    });
  });

  describe("PUT /products/:id", () => {
    it("should update product", async () => {
      Product.findByIdAndUpdate.mockResolvedValue({ _id: "1" });

      const res = await request(app)
        .put("/products/1")
        .send({ nombre: "Updated" });

      expect(Product.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.statusCode).toBe(302);
    });

    it("should return 404 if update fails", async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put("/products/1")
        .send({ nombre: "Updated" });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete product", async () => {
      Product.findByIdAndDelete.mockResolvedValue({ _id: "1" });

      const res = await request(app).delete("/products/1");

      expect(Product.findByIdAndDelete).toHaveBeenCalled();
      expect(res.statusCode).toBe(302);
    });

    it("should return 404 if not found", async () => {
      Product.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete("/products/1");

      expect(res.statusCode).toBe(404);
    });
  });
});
