import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';


const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      if (res.data.user.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/customer-dashboard'); 
      }
    } catch (err) {
      alert('Signup failed: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <select
          name="role"
          className="w-full p-3 mb-6 border rounded-lg"
          value={form.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="owner">Restaurant Owner</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Create Account
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
