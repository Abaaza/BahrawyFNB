import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  Select as ChakraSelect,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'dentist' },
  });
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const url = API_BASE ? `${API_BASE}/auth/register` : '/auth/register';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      navigate('/login');
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4} bg="white" shadow="md" rounded="md">
      {apiError && <Box color="red.500">{apiError}</Box>}
      <FormControl isInvalid={errors.name} mb={4}>
        <FormLabel>Name</FormLabel>
        <Input {...register('name', { required: 'Name is required' })} />
        <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.email} mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: 'Invalid email',
            },
          })}
        />
        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password} mb={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" {...register('password', { required: 'Password is required' })} />
        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Role</FormLabel>
        <ChakraSelect {...register('role', { required: true })}>
          <option value="dentist">Dentist</option>
          <option value="specialist">Specialist</option>
        </ChakraSelect>
      </FormControl>
      <Button type="submit" w="full" bg="teal.500" color="white">
        Register
      </Button>
    </Box>
  );
}

export default RegisterForm;
