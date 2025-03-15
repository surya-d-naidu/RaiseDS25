import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, Ticket, Indent as Student } from 'lucide-react';

const Register = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans = [
    {
      name: 'Standard Pass',
      price: '$599',
      icon: Ticket,
      features: [
        'Access to all conference sessions',
        'Conference materials',
        'Lunch and refreshments',
        'Networking events',
      ],
    },
    {
      name: 'VIP Pass',
      price: '$999',
      icon: CreditCard,
      features: [
        'All Standard Pass features',
        'VIP lounge access',
        'Exclusive networking dinner',
        'One-on-one sessions with speakers',
        'Priority seating',
      ],
    },
    {
      name: 'Student Pass',
      price: '$299',
      icon: Student,
      features: [
        'Access to all conference sessions',
        'Conference materials',
        'Lunch and refreshments',
        'Student networking event',
        'Valid student ID required',
      ],
    },
    {
      name: 'Group Pass',
      price: 'Contact Us',
      icon: Users,
      features: [
        '5+ attendees',
        'Custom package options',
        'Group discount',
        'Dedicated support',
        'Team building activities',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Register for RAISE DS 2025
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Choose your conference pass and be part of the future of data science
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <div className="flex items-center justify-between mb-6">
                <plan.icon className="w-8 h-8 text-blue-400" />
                <div className="text-2xl font-bold">{plan.price}</div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-6 py-2 rounded-full font-medium transition-colors ${
                  selectedPlan === plan.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white/5 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Registration Form</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select your role</option>
                  <option value="professional">Professional</option>
                  <option value="academic">Academic</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Complete Registration
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Register;
