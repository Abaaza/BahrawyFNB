import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function AboutUs() {
  return (
    <Box maxW="2xl" mx="auto" p={8} textAlign="center">
      <Heading as="h1" size="lg" mb={4}>
        About Us
      </Heading>
      <Text>
        Treated Digital Solutions specializes in helping dental and healthcare clinics unlock their true potential online. We combine creativity and industry expertise to deliver marketing, web, and data solutions that make a difference.
      </Text>
    </Box>
  );
}

export default AboutUs;
