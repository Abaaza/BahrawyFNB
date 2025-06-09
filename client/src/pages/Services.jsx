import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function Services() {
  return (
    <Box maxW="2xl" mx="auto" p={8} textAlign="center">
      <Heading as="h1" size="lg" mb={4}>
        Services
      </Heading>
      <Text>
        We provide professional websites, paid advertising campaigns, search engine optimization, social media marketing, branding & print, video production, and more to help your clinic stand out.
      </Text>
    </Box>
  );
}

export default Services;
