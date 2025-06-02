import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';


function Portal() {
  const [token, setToken] = useState(null);
  const [cases, setCases] = useState([]);
  const [description, setDescription] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

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
      body: JSON.stringify({ description }),
    })
      .then((r) => r.json())
      .then((newCase) => {
        setCases([...cases, newCase]);
        setDescription('');
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
      <div className="p-4">
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
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Case Management</h2>
      <form onSubmit={createCase} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Case description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 block"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1">
          Start Case
        </button>
      </form>
      <ul>
        {cases.map((c) => (
          <li
            key={c.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {c.description} - {c.status}
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
