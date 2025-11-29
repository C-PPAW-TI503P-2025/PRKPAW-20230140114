import db from "../models/index.js";
import { Op } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";

const { Presensi, User } = db;
const timeZone = "Asia/Jakarta";

/* ============================
   CHECK-IN (Ambil userId dari JWT + simpan lokasi)
=============================== */
export const CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    console.log("📍 CHECK-IN REQUEST:", { latitude, longitude }); // untuk debug di terminal

    // Validasi body wajib ada
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude dan longitude wajib dikirim!" });
    }

    // Cek check-in aktif
    const existing = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existing) {
      return res.status(400).json({ message: "Anda masih memiliki check-in aktif, silahkan check-out dulu!" });
    }

    // Simpan record baru
    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
    });

    return res.status(201).json({
      message: "Check-In berhasil ✅",
      data: newRecord,
    });

  } catch (err) {
    console.error("🔥 CHECK-IN ERROR:", err.message);
    return res.status(500).json({ message: "Check-In gagal ❌", error: err.message });
  }
};

/* ============================
   CHECK-OUT
=============================== */
export const CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res.status(400).json({ message: "Tidak ada check-in aktif yang bisa di check-out ❌" });
    }

    record.checkOut = new Date();
    await record.save();

    return res.status(200).json({
      message: "Check-Out berhasil ✅",
      data: record,
    });

  } catch (err) {
    console.error("🔥 CHECK-OUT ERROR:", err.message);
    return res.status(500).json({ message: "Check-Out gagal ❌", error: err.message });
  }
};

/* ============================
   DELETE PRESENSI (Admin Only)
=============================== */
export const DeletePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Data presensi tidak ditemukan ❌" });
    }

    await record.destroy();
    return res.status(200).json({ message: `Data presensi ID ${id} berhasil dihapus ✅` });

  } catch (err) {
    console.error("🔥 DELETE ERROR:", err.message);
    return res.status(500).json({ message: "Delete presensi gagal ❌", error: err.message });
  }
};

/* ============================
   DAILY REPORT (Admin + filter nama)
=============================== */
export const GetDailyReports = async (req, res) => {
  try {
    const { nama } = req.query;

    const today = formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");
    const start = new Date(today + "T00:00:00+07:00");
    const end = new Date(today + "T23:59:59+07:00");

    const reports = await Presensi.findAll({
      where: {
        checkIn: { [Op.between]: [start, end] }
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email"],
          where: nama ? { nama: { [Op.like]: `%${nama}%` } } : undefined,
        }
      ],
      order: [["checkIn", "ASC"]]
    });

    return res.status(200).json({
      date: today,
      total: reports.length,
      data: reports,
    });

  } catch (err) {
    console.error("🔥 REPORT ERROR:", err.message);
    return res.status(500).json({ message: "Gagal memuat laporan ❌", error: err.message });
  }
};
