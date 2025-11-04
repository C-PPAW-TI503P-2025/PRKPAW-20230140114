import db from "../models/index.js";
import { Op } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";

const { Presensi } = db;
const timeZone = "Asia/Jakarta";

export const getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query; 

    const today = formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");

    const startOfDay = new Date(`${today}T00:00:00+07:00`);
    const endOfDay = new Date(`${today}T23:59:59+07:00`);

    const whereClause = {
      checkIn: {
        [Op.between]: [startOfDay, endOfDay],
      },
    };

    if (nama) {
      whereClause.nama = { [Op.like]: `%${nama}%` };
    }

    const records = await Presensi.findAll({
      where: whereClause,
      order: [["checkIn", "ASC"]],
    });

    res.status(200).json({
      reportDate: today,
      total: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Terjadi error di getDailyReport:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
