import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import openApiSpec from "./openapi/index";
import authRoutes from "./routes/auth.route";
import crudRoutes from "./routes/crud.route";
import starRoutes from "./routes/star.route";
import forkRoutes from "./routes/fork.route";
import collectionSnippetRoutes from "./routes/collectionSnippet.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionSnippetRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/forks", forkRoutes);
app.use("/api", crudRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
