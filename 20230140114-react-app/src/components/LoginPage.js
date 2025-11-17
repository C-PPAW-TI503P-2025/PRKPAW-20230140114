import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">Login</button>
        </form>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
