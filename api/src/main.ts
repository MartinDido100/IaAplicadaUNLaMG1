import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { router } from "./router/index.js";
import { ErrorHandling } from "./utils/errors.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Rutas
app.use("/api", router);
app.use(ErrorHandling);

app.get("/", (req, res) => {
  res.send("¡Hola desde Express + TypeScript!");
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Movie Recommender API with Swagger",
      version: "0.1.0",
      description:
        "This is a Restful API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/controllers/**/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs as swaggerUi.JsonObject, { explorer: true }),
);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Endpoint disponible: GET /:userId/:movieId`);
});
