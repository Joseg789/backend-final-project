// seed.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import Order from "../models/Order.js";

dotenv.config();

const PRODUCTOS = [
  { nombre: "Chaqueta Impermeable Trail", precio: 189.95 },
  { nombre: "Botas Trekking Summit", precio: 229.0 },
  { nombre: "Mochila 30L Alpine", precio: 95.5 },
  { nombre: "Fleece Summit Pro", precio: 149.95 },
  { nombre: "Pantalón Softshell", precio: 119.0 },
  { nombre: "Gorro Merino", precio: 39.95 },
  { nombre: "Guantes Polar", precio: 49.95 },
  { nombre: "Camiseta Térmica", precio: 59.95 },
  { nombre: "Calcetines Trail", precio: 19.95 },
  { nombre: "Cortavientos Packable", precio: 139.0 },
];

const ESTADOS = [
  "pendiente",
  "procesando",
  "enviado",
  "entregado",
  "cancelado",
];

const CIUDADES = [
  {
    calle: "Calle Mayor 24",
    ciudad: "Madrid",
    codigoPostal: "28013",
    pais: "España",
  },
  {
    calle: "Passeig de Gràcia 45",
    ciudad: "Barcelona",
    codigoPostal: "08007",
    pais: "España",
  },
  {
    calle: "Calle Sierpes 12",
    ciudad: "Sevilla",
    codigoPostal: "41004",
    pais: "España",
  },
  {
    calle: "Gran Vía 78",
    ciudad: "Bilbao",
    codigoPostal: "48001",
    pais: "España",
  },
  {
    calle: "Calle Larios 5",
    ciudad: "Málaga",
    codigoPostal: "29005",
    pais: "España",
  },
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = () => {
  const start = new Date("2024-01-01");
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const randomItems = () => {
  const count = randInt(1, 4);
  const items = [];
  const usados = new Set();

  while (items.length < count) {
    const producto = rand(PRODUCTOS);
    if (usados.has(producto.nombre)) continue;
    usados.add(producto.nombre);
    items.push({
      nombre: producto.nombre,
      precio: producto.precio,
      quantity: randInt(1, 3),
    });
  }
  return items;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Conectado a MongoDB");

    // limpiar datos anteriores del seed
    await User.deleteMany({ email: /seed/ });
    console.log("  Usuarios seed anteriores eliminados");

    const hashedPassword = await bcrypt.hash("password123", 10);
    const createdUsers = [];

    // crear 10 usuarios
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        email: `user${i}.seed@tienda.com`,
        password: hashedPassword,
        role: "user",
      });
      createdUsers.push(user);
      console.log(`Usuario creado: ${user.email}`);
    }

    // crear entre 2 y 6 órdenes por usuario
    let totalOrders = 0;
    for (const user of createdUsers) {
      const numOrders = randInt(2, 6);

      for (let j = 0; j < numOrders; j++) {
        const items = randomItems();
        const total = items.reduce(
          (acc, item) => acc + item.precio * item.quantity,
          0,
        );
        const fecha = randomDate();

        await Order.create({
          user: user._id,
          items,
          total: parseFloat(total.toFixed(2)),
          estado: rand(ESTADOS),
          direccion: rand(CIUDADES),
          createdAt: fecha,
          updatedAt: fecha,
        });

        totalOrders++;
      }
    }

    console.log(
      ` Seed completado — ${createdUsers.length} usuarios y ${totalOrders} órdenes creadas`,
    );
    console.log(" Email:    user1.seed@tienda.com ... user10.seed@tienda.com");
    console.log(" Password: password123");
  } catch (error) {
    console.error(" Error en seed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seed();
