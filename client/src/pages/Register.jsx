import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Link } from '@chakra-ui/react';
import RegisterForm from '../components/RegisterForm.jsx';

function Register() {
  return (
    <Box p={4} maxW="md" mx="auto">
      <Heading as="h2" size="md" mb={4} textAlign="center">
        Register
      </Heading>
      <RegisterForm />
      <Text mt={2} textAlign="center">
        Already have an account?{' '}
        <Link as={RouterLink} to="/login" color="blue.500" textDecor="underline">
          Login
        </Link>
      </Text>
    </Box>
  );
}

export default Register;
