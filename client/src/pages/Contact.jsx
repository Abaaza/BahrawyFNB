import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function Contact() {
  return (
    <Box maxW="2xl" mx="auto" p={8} textAlign="center">
      <Heading as="h1" size="lg" mb={4}>
        Contact Us
      </Heading>
      <Text>
        Email us at info@treatedds.com or call +1 234 567 890 for any inquiries.
      </Text>
    </Box>
  );
}

export default Contact;
