import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import csvRoutes from "./routes/csvRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";
import cors from "cors";
import { connectDB } from "./src/db.js";

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api", csvRoutes);
app.use("/api", excelRoutes);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server berjalan...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
