import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';

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

  if (!project) return <Box p={4}>Loading...</Box>;

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={2}>
        {project.name}
      </Heading>
      <Text mb={4}>{project.description}</Text>
      <Box as="form" onSubmit={addPhoto} mb={4}>
        <Input
          type="text"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          mb={2}
        />
        <Button type="submit" bg="green.500" color="white">
          Add Photo
        </Button>
      </Box>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
        {project.photos &&
          project.photos.map((p) => (
            <Image key={p} src={p} alt="proj" objectFit="cover" h="8rem" w="100%" />
          ))}
      </SimpleGrid>
    </Box>
  );
}

export default ProjectDetail;