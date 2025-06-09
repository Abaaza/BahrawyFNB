import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm.jsx';

function Register() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
      <RegisterForm />
      <p className="mt-2 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
      </p>
    </div>
  );
}

export default Register;
