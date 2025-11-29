import db from "../models/index.js";
import { Op } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";

const { Presensi, User } = db;
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

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["nama"],
        where: nama
          ? {
              nama: {
                [Op.like]: `%${nama}%`,
              },
            }
          : undefined,
      },
    ];

    const records = await Presensi.findAll({
      where: whereClause,
      include: includeClause,
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
