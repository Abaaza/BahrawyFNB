import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Description</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="px-2 py-1 border">{p.name}</td>
              <td className="px-2 py-1 border">{p.description}</td>
              <td className="px-2 py-1 border text-center">
                <Link to={`/projects/${p.id}`} className="text-blue-500 underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;
