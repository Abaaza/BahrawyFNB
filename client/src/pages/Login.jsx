import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';

function Login() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <LoginForm />
      <p className="mt-2 text-center">
        Need an account? <Link to="/register" className="text-blue-500 underline">Register</Link>
      </p>
    </div>
  );
}

export default Login;
