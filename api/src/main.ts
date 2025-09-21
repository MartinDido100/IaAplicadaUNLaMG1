import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import { router } from "./router/index.js";
import { ErrorHandling } from "./utils/errors.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/", router);
app.use(ErrorHandling);

app.get("/", (req, res) => {
  res.send("¡Hola desde Express + TypeScript!");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Endpoint disponible: GET /:userId/:movieId`);
});
