import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'dentist' },
  });
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow rounded">
      {apiError && <p className="text-red-500">{apiError}</p>}
      <div>
        <label className="block mb-1">Name</label>
        <input
          className="border p-2 w-full rounded"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="border p-2 w-full rounded"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: 'Invalid email',
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      <div>
        <label className="block mb-1">Role</label>
        <select className="border p-2 w-full rounded" {...register('role', { required: true })}>
          <option value="dentist">Dentist</option>
          <option value="specialist">Specialist</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
