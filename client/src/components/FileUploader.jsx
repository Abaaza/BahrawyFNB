import React, { useState, useEffect } from 'react';
import { Box, Input, Image, Progress, SimpleGrid } from '@chakra-ui/react';
import { getApiBase } from '../utils/api.js';

const API_BASE = getApiBase();

function FileUploader({ onChange }) {
  const [files, setFiles] = useState([]);

  useEffect(() => () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  const uploadFile = (file, index) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/uploads/photos`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress: pct } : f)),
        );
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.url) {
            setFiles((prev) =>
              prev.map((f, i) =>
                i === index ? { ...f, progress: 100, uploadedUrl: res.url } : f,
              ),
            );
            const urls = [
              ...files.slice(0, index).map((f) => f.uploadedUrl).filter(Boolean),
              res.url,
              ...files
                .slice(index + 1)
                .map((f) => f.uploadedUrl)
                .filter(Boolean),
            ];
            if (onChange) onChange(urls);
          }
        } catch {
          // ignore parse errors
        }
      }
    });

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  };

  const handleSelect = (e) => {
    const list = Array.from(e.target.files);
    const mapped = list.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploadedUrl: null,
    }));
    const startIndex = files.length;
    setFiles((prev) => [...prev, ...mapped]);
    mapped.forEach((m, i) => uploadFile(m.file, startIndex + i));
  };

  return (
    <Box>
      <Input type="file" multiple accept="image/*" onChange={handleSelect} />
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mt={2}>
        {files.map((f, idx) => (
          <Box key={idx} position="relative">
            <Image src={f.preview} alt="preview" objectFit="cover" h="6rem" w="100%" />
            <Progress
              value={f.progress}
              size="xs"
              position="absolute"
              bottom="0"
              left="0"
              right="0"
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default FileUploader;
