import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { User } = db;

// ⚠️ Sebaiknya simpan di .env, tapi untuk testing tidak apa2
const JWT_SECRET = "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    // Validasi data
    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password harus diisi",
      });
    }

    // Validasi role
    if (role && !["mahasiswa", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role tidak valid. Harus 'mahasiswa' atau 'admin'.",
      });
    }

    // Cek email apakah sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "mahasiswa",
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error); // 🔥 sangat penting untuk debug

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // Payload JWT
    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role,
    };

    // Generate token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 penting

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
