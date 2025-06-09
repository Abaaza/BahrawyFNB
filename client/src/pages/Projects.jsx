import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
} from '@chakra-ui/react';

import { getApiBase } from '../utils/api.js';

const API_BASE = getApiBase();

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Projects
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {projects.map((p) => (
            <Tr key={p.id}>
              <Td>{p.name}</Td>
              <Td>{p.description}</Td>
              <Td textAlign="center">
                <Link as={RouterLink} to={`/projects/${p.id}`} color="blue.500" textDecor="underline">
                  View
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default Projects;
