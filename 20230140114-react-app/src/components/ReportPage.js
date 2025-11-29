import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const response = await axios.get(
        `http://localhost:3000/api/reports/daily?nama=${query}`,
        config
      );
      setReports(response.data.data); // sesuaikan jika response.data.data
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

      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Cari</button>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Check-In</th>
            <th className="border px-2 py-1">Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.user?.nama || "N/A"}</td>
                <td className="border px-2 py-1">{new Date(p.checkIn).toLocaleString("id-ID")}</td>
                <td className="border px-2 py-1">{p.checkOut ? new Date(p.checkOut).toLocaleString("id-ID") : "Belum Check-Out"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1 text-center" colSpan="3">Tidak ada data ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
