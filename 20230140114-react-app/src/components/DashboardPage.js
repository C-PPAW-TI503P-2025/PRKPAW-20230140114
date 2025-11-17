import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // asumsi payload punya field 'name' atau 'nama' atau 'email'
      setUser({
        name: decoded.name || decoded.nama || decoded.fullname || decoded.email || 'Pengguna'
      });
    } catch (err) {
      console.error('Token invalid', err);
      // token rusak -> logout
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Login Sukses!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Selamat datang, <span className="font-semibold">{user?.name ?? 'Pengguna'}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Profil</h3>
            <p>Nama: {user?.name}</p>
            <p>Peran: (diambil dari token jika ada)</p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Info</h3>
            <p>Gunakan tombol Logout untuk mengakhiri sesi.</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md font-semibold"
          >
            Logout
          </button>

          <button
            onClick={() => alert('Fitur tambahan dapat ditambahkan di sini.')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold"
          >
            Aksi Lain
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
