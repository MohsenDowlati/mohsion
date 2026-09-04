import express from "express";
// import swaggerUi from "swagger-ui-express";
// import swaggerJSDoc from "swagger-jsdoc";
import { apiRateLimit } from "./middleware/apiRateLimit.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import {workspaceRoutes} from "./modules/workspace/workspace.routes.js";
import {listRoutes} from "./modules/list/list.routes.js";
import operationRoutes from "./modules/operation/operation.routes.js";
import shortUrlRoutes from "./features/short-url/short-url.routes.js";
import {taskRoutes} from "./modules/todo/todo.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));

// const swaggerSpec = swaggerJSDoc({
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Mohsion",
//       version: "1.0.0",
//       description: "JWT auth + workspace/list/task real-time API",
//     },
//     servers: [{ url: "http://localhost:3000" }],
//   },
//   apis: ["./src/modules/**/*.ts"],
// });

// app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api",apiRateLimit);
app.use("/api/auth", authRoutes);
app.use("/api/todo", taskRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/list", listRoutes);
app.use("/api/operation",operationRoutes);

app.use("/s", shortUrlRoutes);


app.use(errorHandler);

export default app;