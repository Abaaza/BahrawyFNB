import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
} from '@chakra-ui/react';

const STATUS_COLORS = {
  new: 'yellow',
  in_progress: 'red',
  completed: 'green',
};

function CaseList({ cases = [], onOpen, onClose }) {
  return (
    <Table variant="simple" mt={4}>
      <Thead>
        <Tr>
          <Th>ClinCheck ID</Th>
          <Th>Status</Th>
          <Th textAlign="center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {cases.map((c) => (
          <Tr key={c.id}>
            <Td>
              {onOpen ? (
                <Button variant="link" onClick={() => onOpen(c.id)}>
                  {c.clinCheckId}
                </Button>
              ) : (
                c.clinCheckId
              )}
            </Td>
            <Td>
              <Badge colorScheme={STATUS_COLORS[c.status] || 'gray'}>
                {c.status}
              </Badge>
            </Td>
            <Td textAlign="center">
              {onClose && (
                <Button onClick={() => onClose(c.id)} bg="red.500" color="white">
                  Close
                </Button>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default CaseList;
