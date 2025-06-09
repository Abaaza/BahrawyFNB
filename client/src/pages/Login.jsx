import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Link } from '@chakra-ui/react';
import LoginForm from '../components/LoginForm.jsx';

function Login() {
  return (
    <Box p={4} maxW="md" mx="auto">
      <Heading as="h2" size="md" mb={4} textAlign="center">
        Login
      </Heading>
      <LoginForm />
      <Text mt={2} textAlign="center">
        Need an account?{' '}
        <Link as={RouterLink} to="/register" color="blue.500" textDecor="underline">
          Register
        </Link>
      </Text>
    </Box>
  );
}

export default Login;
