import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, formData);
      localStorage.setItem('token', res.data.token);
         toast.success("Registration successful!");
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
    toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-700 text-white px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-700 rounded-xl p-10 relative overflow-hidden">

        {/* Left Side Text */}
        <div className="hidden md:block">
          <h2 className="text-4xl font-bold mb-4">Join Us<span className="text-zinc-800"> . . .</span></h2>
          <p className="text-zinc-400">Register now and take control of your attendance tracking.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
            <p className="text-sm text-zinc-400">Start your journey in just a few steps.</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center bg-zinc-800 border border-zinc-600 rounded px-4 py-2">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center bg-zinc-800 border border-zinc-600 rounded px-4 py-2">
            <MdEmail className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center bg-zinc-800 border border-zinc-600 rounded px-4 py-2">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent w-full focus:outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 hover:border text-white py-2 rounded transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
