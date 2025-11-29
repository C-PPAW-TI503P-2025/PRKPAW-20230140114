import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import db from "./models/index.js";

// Router
import bookRouter from "./router/book.js";
import presensiRouter from "./router/presensi.js";
import reportRouter from "./router/reports.js";
import authRouter from "./router/auth.js";

const app = express();
const PORT = 3000;

// ======== MIDDLEWARE GLOBAL ========
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse Form Data

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// ======== ROUTER ========
app.use("/api/auth", authRouter);
app.use("/api/presensi", presensiRouter);
app.use("/api/reports", reportRouter);
app.use("/api/book", bookRouter);

// ======== 404 HANDLER ========
app.use((req, res) => {
  return res.status(404).json({
    message: "Endpoint tidak ditemukan."
  });
});

// ======== ERROR HANDLER GLOBAL ========
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  return res.status(500).json({
    message: "Terjadi kesalahan pada server.",
    error: err.message
  });
});

// ======== DATABASE KONEKSI (TANPA SYNC!!) ========
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Koneksi database berhasil.");

    console.log("🚀 Server siap menerima request...");
    
    app.listen(PORT, () => {
      console.log(`🌍 Server berjalan di http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Gagal koneksi database:", error.message);
  }
};

startServer();
