import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function Dashboard() {
  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Dashboard
      </Heading>
      <Text>Welcome to your dashboard.</Text>
    </Box>
  );
}

export default Dashboard;
