import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function Portal() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ clinCheckId: '', link: '', photo: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signup, setSignup] = useState({ username: '', password: '', role: 'dentist' });

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/portal/cases`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setCases)
        .catch(() => {});
    }
  }, [token]);

  const login = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/portal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('Login failed');
        const data = await r.json();
        setToken(data.token);
        setRole(data.role);
      })
      .catch(() => {
        alert('Invalid credentials');
      });
  };

  const createCase = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/portal/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clinCheckId: form.clinCheckId,
        link: form.link,
        photos: form.photo ? [form.photo] : [],
      }),
    })
      .then((r) => r.json())
      .then((newCase) => {
        setCases([...cases, newCase]);
        setForm({ clinCheckId: '', link: '', photo: '' });
      });
  };

  const closeCase = (id) => {
    fetch(`${API_BASE}/portal/cases/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setCases(cases.filter((c) => c.id !== id));
    });
  };

  if (!token) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Portal Login</h2>
          <form onSubmit={login} className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              className="border p-2 block"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="border p-2 block"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-1">
              Login
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Sign Up</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetch(`${API_BASE}/portal/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signup),
              }).then(() => alert('Account created'));
            }}
            className="space-y-2"
          >
            <input
              type="text"
              placeholder="Username"
              value={signup.username}
              onChange={(e) =>
                setSignup({ ...signup, username: e.target.value })
              }
              className="border p-2 block"
            />
            <input
              type="password"
              placeholder="Password"
              value={signup.password}
              onChange={(e) =>
                setSignup({ ...signup, password: e.target.value })
              }
              className="border p-2 block"
            />
            <select
              value={signup.role}
              onChange={(e) => setSignup({ ...signup, role: e.target.value })}
              className="border p-2 block"
            >
              <option value="dentist">Dentist</option>
              <option value="specialist">Specialist</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-green-500 text-white px-4 py-1">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Case Management</h2>
      <form onSubmit={createCase} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="ClinCheck ID"
          value={form.clinCheckId}
          onChange={(e) => setForm({ ...form, clinCheckId: e.target.value })}
          className="border p-2 block"
        />
        <input
          type="text"
          placeholder="ClinCheck Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="border p-2 block"
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={form.photo}
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
          className="border p-2 block"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1">
          Submit Case
        </button>
      </form>
      <ul>
        {cases.map((c) => (
          <li
            key={c.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {c.clinCheckId} - {c.status}
            </span>
            <button
              onClick={() => closeCase(c.id)}
              className="bg-red-500 text-white px-2 py-1"
            >
              Close
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Portal;
