import express from "express";
import cors from "cors";
import bookRouter from "./router/book.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  console.log(log);
  next();
});

app.use("/api", bookRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

app.use((err, req, res, next) => {
  console.error("Terjadi error:", err.message);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
