import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Portal() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ clinCheckId: '', link: '', photo: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signup, setSignup] = useState({ username: '', password: '', role: 'dentist' });

  const loadCases = () => {
    fetch(`${API_BASE}/portal/cases`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCases)
      .catch(() => {});
  };

  useEffect(() => {
    if (token) {
      loadCases();
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

  const openCase = (id) => {
    setSelectedId(id);
    fetch(`${API_BASE}/portal/cases/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCaseDetail);
    fetch(`${API_BASE}/portal/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setReviews);
  };

  const assignCase = (id) => {
    fetch(`${API_BASE}/portal/cases/${id}/assign`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => loadCases());
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
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="border p-2 block"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
              onChange={(e) => setSignup({ ...signup, username: e.target.value })}
              className="border p-2 block"
            />
            <input
              type="password"
              placeholder="Password"
              value={signup.password}
              onChange={(e) => setSignup({ ...signup, password: e.target.value })}
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

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="assigned">Assigned</option>
        <option value="reviewed">Reviewed</option>
      </select>

      {caseDetail && selectedId && (
        <div className="mb-4 border p-2">
          <h3 className="font-semibold mb-2">Case {caseDetail.clinCheckId}</h3>
          {caseDetail.link && (
            <a href={caseDetail.link} className="text-blue-500 underline">
              ClinCheck Link
            </a>
          )}
          <div className="flex space-x-2 mt-2">
            {caseDetail.photos.map((p) => (
              <img key={p} src={p} alt="photo" className="w-24 h-24 object-cover" />
            ))}
          </div>
          {role === 'specialist' && !caseDetail.assignedTo && (
            <button
              onClick={() => assignCase(caseDetail.id)}
              className="bg-blue-500 text-white px-2 py-1 mt-2"
            >
              Claim Case
            </button>
          )}
          <h4 className="font-medium mt-2">Reviews</h4>
          <ul className="list-disc ml-5">
            {reviews.map((r) => (
              <li key={r.id}>{r.notes}</li>
            ))}
          </ul>
        </div>
      )}

      <ul>
        {cases
          .filter((c) => !statusFilter || c.status === statusFilter)
          .map((c) => (
            <li
              key={c.id}
              className="border p-2 mb-2 flex justify-between items-center"
            >
              <button
                type="button"
                onClick={() => openCase(c.id)}
                className="underline mr-2"
              >
                {c.clinCheckId}
              </button>
              <span className="flex-1">{c.status}</span>
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
