import { presensiData } from "../data/presensiData.js";

export const getDailyReport = (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const todayData = presensiData.filter((p) => p.checkIn.toISOString().startsWith(today));

  res.status(200).json({
    reportDate: today,
    total: todayData.length,
    data: todayData,
  });
};
