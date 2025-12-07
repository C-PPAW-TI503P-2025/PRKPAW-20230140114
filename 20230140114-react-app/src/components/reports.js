import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Modal foto fullscreen
  const navigate = useNavigate();

  // Fetch laporan
  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get(
        `http://localhost:3000/api/reports/daily?nama=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(res.data.data); // Data presensi
      setError(null);
    } catch (err) {
      setError("Gagal memuat data");
    }
  };

  useEffect(() => {
    fetchReports("");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Laporan Presensi Harian</h2>

      {/* FORM SEARCH */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Cari
        </button>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* TABEL LAPORAN */}
      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Check-In</th>
            <th className="border px-2 py-1">Check-Out</th>
            <th className="border px-2 py-1">Bukti Foto</th>
          </tr>
        </thead>

        <tbody>
          {reports.length > 0 ? (
            reports.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.user?.nama || "N/A"}</td>
                <td className="border px-2 py-1">
                  {new Date(p.checkIn).toLocaleString("id-ID")}
                </td>
                <td className="border px-2 py-1">
                  {p.checkOut ? new Date(p.checkOut).toLocaleString("id-ID") : "Belum Check-Out"}
                </td>
                <td className="border px-2 py-1 text-center">
                  {p.buktiFoto ? (
                    <img
                      src={`http://localhost:3000${p.buktiFoto}`} // ✅ Perbaikan: hapus /uploads/ tambahan
                      alt="bukti"
                      className="w-14 h-14 object-cover rounded cursor-pointer hover:opacity-80 border"
                      onClick={() => setSelectedImage(`http://localhost:3000${p.buktiFoto}`)}
                    />
                  ) : (
                    "Tidak ada foto"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1 text-center" colSpan="4">
                Tidak ada data ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL FOTO FULLSCREEN */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
