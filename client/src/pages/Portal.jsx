import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth.js';

const API_BASE = 'http://localhost:3000';

function Portal() {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ clinCheckId: '', link: '', photo: '' });


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

    useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

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
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">ClinCheck ID</th>
            <th className="border px-2 py-1 text-left">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases
            .filter((c) => !statusFilter || c.status === statusFilter)
            .map((c) => (
              <tr key={c.id} className="border-b">
                <td className="border px-2 py-1">
                  <button type="button" onClick={() => openCase(c.id)} className="underline">
                    {c.clinCheckId}
                  </button>
                </td>
                <td className="border px-2 py-1">{c.status}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => closeCase(c.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
 
    </div>
  );
}

export default Portal;
