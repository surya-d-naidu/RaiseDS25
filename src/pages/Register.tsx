import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  User,
  Briefcase,
  Building,
  BookOpen,
  AlignLeft,
  MapPin,
  Phone,
  GraduationCap,
  Icon as LucideIcon,
} from 'lucide-react';
import axios, { AxiosResponse } from 'axios';
import Earth from '../assets/background.jpg';

// List of Indian states for the dropdown
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface FormData {
  title: string;
  fullName: string;
  designation: string;
  department: string;
  topic: string;
  abstract: string;
  state: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  institution: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    fullName: '',
    designation: 'Professor',
    department: '',
    topic: '',
    abstract: '',
    state: '',
    email: '',
    mobileCountryCode: '+91',
    mobileNumber: '',
    institution: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const response: AxiosResponse = await axios.post(
        'https://websocket-server-sigma.vercel.app/submit',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert('Registration successful!');
      setFormData({
        title: '',
        fullName: '',
        designation: 'Professor',
        department: '',
        topic: '',
        abstract: '',
        state: '',
        email: '',
        mobileCountryCode: '+91',
        mobileNumber: '',
        institution: '',
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fields: {
    icon: LucideIcon;
    name: keyof FormData | 'phone';
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
  }[] = [
    { icon: User,        name: 'title',       label: 'Title',             type: 'select', options: ['Mr.', 'Mrs.', 'Dr.', 'Prof.'] },
    { icon: User,        name: 'fullName',    label: 'Full Name',         type: 'text',   placeholder: 'John Doe' },
    { icon: Briefcase,   name: 'designation', label: 'Designation',       type: 'select', options: ['Student', 'Assistant Professor', 'Associate Professor', 'Professor'] },
    { icon: Building,    name: 'department',  label: 'Department/School', type: 'text',   placeholder: 'Department Name' },
    { icon: BookOpen,    name: 'topic',       label: 'Topic',             type: 'select', options: [
        'Descriptive Statistics',
        'Inferential Statistics',
        'Probability Theory',
        'Regression Analysis',
        'Statistical Inference',
        'Data Mining',
      ]
    },
    { icon: AlignLeft,   name: 'abstract',    label: 'Abstract',          type: 'text',   placeholder: 'Brief summary of your work' },
    { icon: MapPin,      name: 'state',       label: 'State',             type: 'select', options: states },
    { icon: Mail,        name: 'email',       label: 'Email Address',     type: 'email',  placeholder: 'john@example.com' },
    { icon: Phone,       name: 'phone',       label: 'Phone Number',      type: 'phone' },
    { icon: GraduationCap, name: 'institution', label: 'Institution',     type: 'text',   placeholder: 'Your institution' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 relative overflow-hidden">
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
            Register
          </h1>
          <p className="text-gray-300">Join RAISE DS 2025 and share your work</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, idx) => (
              <motion.div
                key={field.name + idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {field.name === 'phone' ? (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="flex space-x-2 relative">
                      <input
                        type="text"
                        name="mobileCountryCode"
                        value={formData.mobileCountryCode}
                        disabled
                        className="w-1/4 bg-white/10 rounded-lg pl-4 pr-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="10‑digit number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-3/4 bg-white/10 rounded-lg pl-4 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </>
                ) : field.type === 'select' ? (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <select
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="" disabled>
                          Select {field.label}
                        </option>
                        {field.options!.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type}
                        name={field.name as string}
                        placeholder={field.placeholder}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </>
                )}
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Register
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
