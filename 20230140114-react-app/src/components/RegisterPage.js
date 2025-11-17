import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('mahasiswa'); // default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = { nama: name, email, password, role };
      // sesuaikan baseURL jika backend beda
      const res = await axios.post('http://localhost:3000/api/auth/register', payload);
      setSuccessMsg(res.data.message || 'Registrasi berhasil. Silakan login.');
      // arahkan setelah delay singkat agar mahasiswa sempat lihat pesan
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal registrasi');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md font-semibold"
          >
            Register
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {successMsg && <p className="text-green-600 mt-4 text-center">{successMsg}</p>}

        <p className="text-sm text-center mt-4">
          Sudah punya akun? <button onClick={() => navigate('/login')} className="text-blue-600 underline">Login</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
