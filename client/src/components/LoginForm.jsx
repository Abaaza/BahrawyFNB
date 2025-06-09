import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../utils/auth.js';
import { getApiBase } from '../utils/api.js';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

const API_BASE = getApiBase();

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const url = API_BASE ? `${API_BASE}/portal/login` : '/portal/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      const result = await res.json();
      setAuth(result.token, result.role);
      navigate('/portal');
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4} bg="white" shadow="md" rounded="md">
      {apiError && <Box color="red.500">{apiError}</Box>}
      <FormControl isInvalid={errors.username} mb={4}>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          {...register('username', {
            required: 'Username is required',
          })}
        />
        <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password} mb={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" {...register('password', { required: 'Password is required' })} />
        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" w="full" bg="teal.500" color="white">
        Login
      </Button>
    </Box>
  );
}

export default LoginForm;
