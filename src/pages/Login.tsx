import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import Earth from '../assets/background.jpg';
import { Link } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://your-login-api-endpoint.com/login', formData);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('jwtToken', token);
        alert('Login successful!');
        // Optional redirect logic
      } else {
        alert('Login failed. No token received.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 relative">
      {/* Background */}
      <img
        src={Earth}
        alt="Earth Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
      />

      {/* Login Form */}
      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Login
          </h1>
          <p className="text-gray-300">Welcome back to RAISE DS 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Login
            </motion.button>
          </form>

          {/* Sign Up Redirect */}
          <div className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
