import React, { useState } from 'react';
import API from '../../api/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      console.log('Login successful:', res.data.user.role);
      if (res.data.user.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/customer-dashboard'); 
      }
    } catch (err) {
      alert('Login failed: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Log In
        </button>
        <p className="text-sm text-center mt-4">
          Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>  {/* Use Link here */}
        </p>
      </form>
    </div>
  );
};

export default SignIn;
