import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problems.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
