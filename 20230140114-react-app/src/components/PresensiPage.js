import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon marker agar muncul di React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PresensiPage() {
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ambil lokasi asli browser/perangkat user (untuk center map)
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Browser tidak mendukung geolocation.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mengambil lokasi: " + err.message);
        }
      );
    };

    getLocation();
  }, []);

  // Check-In (kirim latitude, longitude ke backend)
  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Silahkan login ulang, token tidak tersedia.");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(res.data.message || "Check-In berhasil.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Check-In gagal.");
      setMessage("");
    }
  };

  // Check-Out
  const handleCheckOut = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Silahkan login ulang, token tidak tersedia.");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/presensi/check-out",
        {},
        config
      );

      setMessage(res.data.message || "Check-Out berhasil.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Check-Out gagal.");
      setMessage("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* =========== BANNER KOORDINAT =========== */}
      {coords && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold">📍 Lokasi Presensi Anda</h2>
          <p className="text-sm opacity-90">
            Lat: {coords.lat.toFixed(8)}, Lng: {coords.lng.toFixed(8)}
          </p>
        </div>
      )}

      {/* =========== PETA OSM (diperkecil) =========== */}
      {coords && (
        <div className="my-4 rounded-2xl overflow-hidden shadow-lg border">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }} // ✅ ukuran map diperkecil
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Presensi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* =========== JUDUL =========== */}
      <h3 className="text-center text-2xl font-bold mt-6 mb-4">Lakukan Presensi</h3>

      {/* =========== STATUS =========== */}
      {message && (
        <p className="text-center bg-green-100 text-green-700 py-2 px-3 rounded-xl mb-3 border border-green-200">
          ✅ {message}
        </p>
      )}

      {error && (
        <p className="text-center bg-red-100 text-red-700 py-2 px-3 rounded-xl mb-3 border border-red-200">
          ❌ {error}
        </p>
      )}

      {/* =========== TOMBOL =========== */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleCheckIn}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-2xl shadow-lg flex items-center gap-2"
        >
          ✔️ Check-In
        </button>

        <button
          onClick={handleCheckOut}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl shadow-lg flex items-center gap-2"
        >
          ✖️ Check-Out
        </button>
      </div>
    </div>
  );
}
