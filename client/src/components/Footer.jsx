import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Text, Input, Button, Checkbox } from '@chakra-ui/react';


function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="white" p={8} textAlign="center">
      <Flex justify="center" gap={4} mb={4}>
        <Link as={RouterLink} to="/">Home</Link>
        <Link as={RouterLink} to="/about">About Us</Link>
        <Link as={RouterLink} to="/services">Services</Link>
        <Link as={RouterLink} to="/contact">Contact</Link>
      </Flex>
      <Box my={4}>
        <Text mb={2} fontWeight="semibold">
          Stay Up to Date
        </Text>
        <Input
          type="email"
          placeholder="Email*"
          width="auto"
          display="inline-block"
          color="gray.800"
          mr={2}
        />
        <Button bg="teal.500" color="white">Submit</Button>
        <Box mt={2} fontSize="sm">
          <Checkbox mr={1} /> Yes, subscribe me to your newsletter.
        </Box>
      </Box>
      <Text mt={4}>info@treatedds.com</Text>
      <Box mt={2}>
        <Link href="#" mr={1} textDecor="underline">
          Facebook
        </Link>
        |
        <Link href="#" ml={1} textDecor="underline">
          LinkedIn
        </Link>
      </Box>
      <Text mt={4} fontSize="sm">
        © 2025 by Treated Digital Solutions, All rights reserved.
      </Text>
    </Box>
  );
}

export default Footer;