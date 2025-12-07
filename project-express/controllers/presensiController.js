// ===================== IMPORT =====================
import db from "../models/index.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";

const { Presensi, User } = db;
const timeZone = "Asia/Jakarta";

// ===================== FIX __dirname (karena pakai ESM) =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); 
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// ============================
// CHECK-IN (dengan bukti foto)
// ============================
export const CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    console.log("📍 CHECK-IN REQUEST:", {
      latitude,
      longitude,
      file: req.file,
    });

    // Validasi lokasi wajib
    if (latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ message: "Latitude dan longitude wajib dikirim!" });
    }

    // Cek apakah masih ada check-in aktif
    const existing = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existing) {
      return res.status(400).json({
        message:
          "Anda masih memiliki check-in aktif, silahkan check-out dulu!",
      });
    }

    // Ambil path foto upload
    const buktiFoto = req.file ? `/uploads/${req.file.filename}` : null;

    // Simpan data presensi
    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
      buktiFoto, 
    });

    return res.status(201).json({
      message: "Check-In berhasil ✅",
      data: newRecord,
    });
  } catch (err) {
    console.error("🔥 CHECK-IN ERROR:", err.message);
    return res
      .status(500)
      .json({ message: "Check-In gagal ❌", error: err.message });
  }
};

// ============================
// CHECK-OUT
// ============================
export const CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res
        .status(400)
        .json({ message: "Tidak ada check-in aktif ❌" });
    }

    record.checkOut = new Date();
    await record.save();

    return res.status(200).json({
      message: "Check-Out berhasil ✅",
      data: record,
    });
  } catch (err) {
    console.error("🔥 CHECK-OUT ERROR:", err.message);
    return res
      .status(500)
      .json({ message: "Check-Out gagal ❌", error: err.message });
  }
};

// ============================
// DELETE PRESENSI
// ============================
export const DeletePresensi = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Presensi.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ message: "Data presensi tidak ditemukan ❌" });
    }

    await record.destroy();

    return res.status(200).json({
      message: `Data presensi ID ${id} berhasil dihapus ✅`,
    });
  } catch (err) {
    console.error("🔥 DELETE ERROR:", err.message);
    return res
      .status(500)
      .json({ message: "Delete presensi gagal ❌", error: err.message });
  }
};

// ============================
// DAILY REPORT
// ============================
export const GetDailyReports = async (req, res) => {
  try {
    const { nama } = req.query;

    const today = formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");
    const start = new Date(today + "T00:00:00+07:00");
    const end = new Date(today + "T23:59:59+07:00");

    const reports = await Presensi.findAll({
      where: {
        checkIn: { [Op.between]: [start, end] },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email"],
          where: nama
            ? { nama: { [Op.like]: `%${nama}%` } }
            : undefined,
        },
      ],
      order: [["checkIn", "ASC"]],
    });

    return res.status(200).json({
      date: today,
      total: reports.length,
      data: reports,
    });
  } catch (err) {
    console.error("🔥 REPORT ERROR:", err.message);
    return res
      .status(500)
      .json({ message: "Gagal memuat laporan ❌", error: err.message });
  }
};
