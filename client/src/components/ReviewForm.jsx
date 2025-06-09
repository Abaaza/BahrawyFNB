import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  Textarea,
  Heading,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { getApiBase } from '../utils/api.js';

const API_BASE = getApiBase();

const SECTIONS = [
  { id: 'modifications', label: 'Modifications' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'ipr', label: 'IPR' },
];

function ReviewForm() {
  const [options, setOptions] = useState({});
  const [selections, setSelections] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    SECTIONS.forEach(async (s) => {
      try {
        const res = await fetch(`${API_BASE}/api/clinical-statements?section=${s.id}`);
        if (res.ok) {
          const data = await res.json();
          setOptions((prev) => ({ ...prev, [s.id]: Array.isArray(data) ? data : [] }));
        }
      } catch {
        setOptions((prev) => ({ ...prev, [s.id]: [] }));
      }
    });
  }, []);

  const handleSelect = (section, value) => {
    setSelections((prev) => ({ ...prev, [section]: value }));
  };

  const handleNote = (section, value) => {
    setNotes((prev) => ({ ...prev, [section]: value }));
  };

  const renderPreview = () => (
    <Box borderWidth="1px" p={4} bg="gray.50" rounded="md" mt={4}
         fontFamily="monospace">
      <Heading as="h3" size="md" mb={2} textAlign="center">
        Report Preview
      </Heading>
      {SECTIONS.map((s) => (
        <Box key={s.id} mb={2}>
          <Text fontWeight="bold">{s.label}</Text>
          <Text whiteSpace="pre-wrap">
            {selections[s.id] || ''}
            {selections[s.id] && notes[s.id] ? ' - ' : ''}
            {notes[s.id] || ''}
          </Text>
          <Divider my={2} />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {SECTIONS.map((s) => (
          <Box key={s.id}>
            <Heading as="h4" size="sm" mb={1}>
              {s.label}
            </Heading>
            <Select
              placeholder={`Select ${s.label}`}
              value={selections[s.id] || ''}
              onChange={(e) => handleSelect(s.id, e.target.value)}
              mb={2}
            >
              {(options[s.id] || []).map((opt) => (
                <option key={opt.id || opt} value={opt.text || opt}>
                  {opt.text || opt}
                </option>
              ))}
            </Select>
            <Textarea
              placeholder={`Additional notes for ${s.label}`}
              value={notes[s.id] || ''}
              onChange={(e) => handleNote(s.id, e.target.value)}
            />
          </Box>
        ))}
      </VStack>
      {renderPreview()}
    </Box>
  );
}

export default ReviewForm;
