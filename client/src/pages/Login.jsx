import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setAuth } from '../utils/auth.js';

const API_BASE = 'http://localhost:3000';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/portal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('Login failed');
        const data = await r.json();
        setAuth(data.token, data.role);
        navigate('/portal');
      })
      .catch(() => alert('Invalid credentials'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
      <p className="mt-2 text-center">
        Need an account? <Link to="/register" className="text-blue-500 underline">Register</Link>
      </p>
    </div>
  );
}

export default Login;
