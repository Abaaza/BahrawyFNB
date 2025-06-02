import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [photo, setPhoto] = useState('');

  const loadProject = () => {
    fetch(`${API_BASE}/projects/${id}`)
      .then((r) => r.json())
      .then(setProject)
      .catch(() => {});
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const addPhoto = (e) => {
    e.preventDefault();
    if (!photo) return;
    const photos = project.photos ? [...project.photos, photo] : [photo];
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos }),
    })
      .then(() => {
        setPhoto('');
        loadProject();
      })
      .catch(() => {});
  };

  if (!project) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{project.name}</h2>
      <p className="mb-4">{project.description}</p>
      <form onSubmit={addPhoto} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          className="border p-2 block"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1">
          Add Photo
        </button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {project.photos && project.photos.map((p) => (
          <img key={p} src={p} alt="proj" className="w-full h-32 object-cover" />
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;