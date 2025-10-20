import { presensiData } from "../data/presensiData.js";

export const CheckIn = (req, res) => {
  const user = req.user;

  const sudahCheckIn = presensiData.find(
    (p) => p.userId === user.id && !p.checkOut
  );

  if (sudahCheckIn) {
    return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
  }

  const now = new Date();
  const newRecord = {
    userId: user.id,
    nama: user.nama,
    checkIn: now,
    checkOut: null,
  };

  presensiData.push(newRecord);

  res.status(201).json({
    message: `Halo ${user.nama}, check-in berhasil pada ${now.toLocaleTimeString()}`,
    data: newRecord,
  });
};

export const CheckOut = (req, res) => {
  const user = req.user;

  const record = presensiData.find(
    (p) => p.userId === user.id && !p.checkOut
  );

  if (!record) {
    return res.status(404).json({ message: "Anda belum melakukan check-in." });
  }

  record.checkOut = new Date();

  res.status(200).json({
    message: `Terima kasih ${user.nama}, check-out berhasil pada ${record.checkOut.toLocaleTimeString()}`,
    data: record,
  });
};
