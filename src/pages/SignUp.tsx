import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Earth from '../assets/background.jpg';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://your-server.com/register', {
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message || "Verification email sent. Please check your inbox.");
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    icon: React.ElementType;
    name: keyof FormData;
    type: string;
    label: string;
    placeholder: string;
  }[] = [
    {
      icon: Mail,
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
    },
    {
      icon: Lock,
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter a secure password',
    },
    {
      icon: Lock,
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Repeat your password',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 relative">
      <img
        src={Earth}
        alt="Earth Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
      />

      <div className="relative max-w-md mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Sign Up
          </h1>
          <p className="text-gray-300">
            Create your account and verify your email
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            ))}

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              {loading ? 'Submitting...' : 'Sign Up'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
