import cors from "cors";
import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { router } from "./router/index.js";
import { Constants, ErrorHandling } from "./utils/index.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS con whitelist
app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "linear-signature"],
    credentials: true,
  }),
);

// Rutas
app.use("/api", router);
app.use(ErrorHandling);

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
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
});
