import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError("Gagal mengambil lokasi: " + err.message)
    );
  }, []);

  const handleCheckIn = async () => {
    if (!coords || !image) return setError("Lokasi dan foto wajib ada!");

    const token = localStorage.getItem("token");
    if (!token) return setError("Silahkan login ulang.");

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const res = await axios.post("http://localhost:3000/api/presensi/check-in", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      setError("");
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Check-In gagal");
      setMessage("");
    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Silahkan login ulang.");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Check-Out gagal");
      setMessage("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {coords && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg mb-4">
          <h2 className="text-xl font-semibold">📍 Lokasi Presensi Anda</h2>
          <p className="text-sm opacity-90">
            Lat: {coords.lat.toFixed(8)}, Lng: {coords.lng.toFixed(8)}
          </p>
        </div>
      )}

      {coords && (
        <div className="my-4 rounded-2xl overflow-hidden shadow-lg border">
          <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: "300px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <h3 className="text-center text-2xl font-bold mt-6 mb-4">Ambil Foto Presensi</h3>

      <div className="my-4 border rounded-lg overflow-hidden bg-black">
        {image ? <img src={image} alt="Selfie" className="w-full" /> : <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full" />}
      </div>

      <div className="mb-4">
        {!image ? (
          <button onClick={capture} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Ambil Foto 📸</button>
        ) : (
          <button onClick={() => setImage(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">Foto Ulang 🔄</button>
        )}
      </div>

      {message && <p className="text-center bg-green-100 text-green-700 py-2 px-3 rounded-xl mb-3 border border-green-200">✅ {message}</p>}
      {error && <p className="text-center bg-red-100 text-red-700 py-2 px-3 rounded-xl mb-3 border border-red-200">❌ {error}</p>}

      <div className="flex justify-center gap-4 mt-4">
        <button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-2xl shadow-lg flex items-center gap-2">✔️ Check-In</button>
        <button onClick={handleCheckOut} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl shadow-lg flex items-center gap-2">✖️ Check-Out</button>
      </div>
    </div>
  );
}
