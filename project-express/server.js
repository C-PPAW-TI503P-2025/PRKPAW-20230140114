import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import db from "./models/index.js";


import bookRouter from "./router/book.js";
import presensiRouter from "./router/presensi.js"; 
import reportRouter from "./router/reports.js";    

const app = express();
const PORT = 3000;

app.use(cors());              
app.use(helmet());            
app.use(express.json());      
app.use(morgan("dev"));      


app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  console.log(log);
  next();
});

app.use("/api", bookRouter);

app.use("/api/presensi", presensiRouter);

app.use("/api/reports", reportRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

app.use((err, req, res, next) => {
  console.error("Terjadi error:", err.message);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

db.sequelize.authenticate()
  .then(() => console.log("Koneksi database berhasil."))
   .catch(err => console.error("Gagal koneksi ke database:", err));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
