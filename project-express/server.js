import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import db from "./models/index.js";

// Router
import bookRouter from "./router/book.js";
import presensiRouter from "./router/presensi.js";
import reportRouter from "./router/reports.js";
import authRouter from "./router/auth.js";

const app = express();
const PORT = 3000;

// ========================
// FIX __dirname (ESM)
// ========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// MIDDLEWARE GLOBAL
// ========================
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// ========================
// STATIC FOLDER UPLOADS
// (WAJIB supaya foto presensi tampil)
// ========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================
// ROUTER
// ========================
app.use("/api/auth", authRouter);
app.use("/api/presensi", presensiRouter);
app.use("/api/reports", reportRouter);
app.use("/api/book", bookRouter);

// ========================
// 404 NOT FOUND HANDLER
// ========================
app.use((req, res) => {
  return res.status(404).json({
    message: "Endpoint tidak ditemukan.",
  });
});

// ========================
// GLOBAL ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  return res.status(500).json({
    message: "Terjadi kesalahan pada server.",
    error: err.message,
  });
});

// ========================
// START SERVER
// ========================
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Koneksi database berhasil.");

    app.listen(PORT, () => {
      console.log(`🌍 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Gagal koneksi database:", error.message);
  }
};

startServer();
