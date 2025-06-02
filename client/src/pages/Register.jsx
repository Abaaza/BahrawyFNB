import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'dentist' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/portal/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        alert('Account created');
        navigate('/login');
      })
      .catch(() => alert('Signup failed'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
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
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="dentist">Dentist</option>
          <option value="specialist">Specialist</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full">
          Sign Up
        </button>
      </form>
      <p className="mt-2 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
      </p>
    </div>
  );
}

export default Register;
