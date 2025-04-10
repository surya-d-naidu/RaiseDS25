import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Building, FileText, Phone } from 'lucide-react';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    abstract: '',
    email: '',
    mobile: '',
    institution: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://websocket-server-sigma.vercel.app/submit', formData);
      console.log(response.data);
      alert('Submission successful!');
      setFormData({
        name: '',
        topic: '',
        abstract: '',
        email: '',
        mobile: '',
        institution: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Submit Your Abstract
          </h1>
          <p className="text-gray-300">
            Join RAISE DS 2025 and share your work
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              {
                icon: User,
                name: 'name',
                label: 'Full Name',
                type: 'text',
                placeholder: 'John Doe',
              },
              {
                icon: FileText,
                name: 'topic',
                label: 'Topic',
                type: 'text',
                placeholder: 'Your topic',
              },
              {
                icon: FileText,
                name: 'abstract',
                label: 'Abstract',
                type: 'text',
                placeholder: 'Brief summary of your work',
              },
              {
                icon: Mail,
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'john@example.com',
              },
              {
                icon: Phone,
                name: 'mobile',
                label: 'Mobile Number',
                type: 'tel',
                placeholder: '+91XXXXXXXXXX',
              },
              {
                icon: Building,
                name: 'institution',
                label: 'Institution',
                type: 'text',
                placeholder: 'Your institution',
              },
            ].map((field, index) => (
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
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      required
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  )}
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
