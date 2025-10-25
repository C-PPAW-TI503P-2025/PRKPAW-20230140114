export const addUserData = (req, res, next) => {
  req.user = { id: 1, nama: "User Karyawan", role: "user" };
  next();
};

export const checkAdmin = (req, res, next) => {
  const user = { id: 99, nama: "admin utama", role: "admin" };
  req.user = user;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak: hanya untuk admin." });
  }

  next();
};
