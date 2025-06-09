import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth.js';
import {
  Box,
  Heading,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';

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
    <Box p={4}>
      <Heading as="h2" size="lg" mb={2}>
        Case Management
      </Heading>
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
        <Input
          type="text"
          placeholder="Photo URL"
          value={form.photo}
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
          mt={2}
        />
        <Button type="submit" mt={2} bg="green.500" color="white">
          Submit Case
        </Button>
      </Box>

      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="assigned">Assigned</option>
        <option value="reviewed">Reviewed</option>
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
            {caseDetail.photos.map((p) => (
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
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>ClinCheck ID</Th>
            <Th>Status</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cases
            .filter((c) => !statusFilter || c.status === statusFilter)
            .map((c) => (
              <Tr key={c.id}>
                <Td>
                  <Button variant="link" onClick={() => openCase(c.id)}>
                    {c.clinCheckId}
                  </Button>
                </Td>
                <Td>{c.status}</Td>
                <Td textAlign="center">
                  <Button onClick={() => closeCase(c.id)} bg="red.500" color="white">
                    Close
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

    </Box>
  );
}

export default Portal;
