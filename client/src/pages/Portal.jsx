import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth.js';
import { getApiBase } from '../utils/api.js';
import {
  Box,
  Heading,
  Input,
  Button,
  Select,
  Link,
  SimpleGrid,
  Image,
  Text,
} from '@chakra-ui/react';
import CaseList from '../components/CaseList.jsx';
import FileUploader from '../components/FileUploader.jsx';

const API_BASE = getApiBase();

function Portal() {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ clinCheckId: '', link: '', photos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const loadCases = async () => {
    const authToken = localStorage.getItem('token');
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/portal/cases`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        throw new Error('Failed to load cases');
      }
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.cases)
        ? data.cases
        : [];
      setCases(list);
    } catch (err) {
      console.error(err);
      setCases([]);
      setError('Unable to load cases');
    } finally {
      setLoading(false);
    }
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
        photos: form.photos,
      }),
    })
      .then((r) => r.json())
      .then((newCase) => {
        setCases([...cases, newCase]);
        setForm({ clinCheckId: '', link: '', photos: [] });
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

  const openCase = async (id) => {
    setSelectedId(id);
    const authToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/portal/cases/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch case');
      }
      const detail = await res.json();
      detail.photos = Array.isArray(detail.photos)
        ? detail.photos.filter((p) => /^https?:\/\//.test(p))
        : [];
      setCaseDetail(detail);
      const revRes = await fetch(`${API_BASE}/portal/reviews/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!revRes.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const revData = await revRes.json();
      setReviews(Array.isArray(revData) ? revData : []);
    } catch (err) {
      console.error(err);
      setCaseDetail(null);
      setReviews([]);
    }
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
    <Box p={4}>
      <Heading as="h2" size="lg" mb={2}>
        Case Management
      </Heading>
      {loading && <Text>Loading cases...</Text>}
      {error && (
        <Text color="red.500" mb={2}>
          {error}
        </Text>
      )}
      <Box as="form" onSubmit={createCase} mb={4}>
        <Input
          type="text"
          placeholder="ClinCheck ID"
          value={form.clinCheckId}
          onChange={(e) => setForm({ ...form, clinCheckId: e.target.value })}
        />
        <Input
          type="text"
          placeholder="ClinCheck Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          mt={2}
        />
        <Box mt={2}>
          <FileUploader onChange={(urls) => setForm({ ...form, photos: urls })} />
        </Box>
        <Button type="submit" mt={2} bg="green.500" color="white">
          Submit Case
        </Button>
      </Box>

      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="new">New</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </Select>

      {caseDetail && selectedId && (
        <Box mb={4} borderWidth="1px" p={2}>
          <Heading as="h3" size="md" mb={2}>
            Case {caseDetail.clinCheckId}
          </Heading>
          {caseDetail.link && (
            <Link href={caseDetail.link} color="blue.500" textDecor="underline">
              ClinCheck Link
            </Link>
          )}
          <SimpleGrid columns={4} spacing={2} mt={2}>
            {Array.isArray(caseDetail.photos) &&
              caseDetail.photos.map((p) => (
                <Image key={p} src={p} alt="photo" objectFit="cover" h="6rem" />
              ))}
          </SimpleGrid>
          {role === 'specialist' && !caseDetail.assignedTo && (
            <Button onClick={() => assignCase(caseDetail.id)} bg="blue.500" color="white" mt={2}>
              Claim Case
            </Button>
          )}
          <Heading as="h4" size="sm" mt={2}>
            Reviews
          </Heading>
          <Box as="ul" pl={5} style={{ listStyleType: 'disc' }}>
            {reviews.map((r) => (
              <li key={r.id}>{r.notes}</li>
            ))}
          </Box>
        </Box>
      )}
      <CaseList
        cases={Array.isArray(cases)
          ? cases.filter((c) => !statusFilter || c.status === statusFilter)
          : []}
        onOpen={openCase}
        onClose={closeCase}
      />

    </Box>
  );
}

export default Portal;
