import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Message sent successfully!');
    setTimeout(() => setFormStatus(''), 3000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!formRef.current) return;
      
      const { left, top, width, height } = formRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      
      formRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Have questions? We're here to help you with anything related to Rise DS 2025
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "info@riseds2025.com",
                  link: "mailto:info@riseds2025.com",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+1 (555) 123-4567",
                  link: "tel:+15551234567",
                },
                {
                  icon: MapPin,
                  title: "Address",
                  content: "Stanford University\n450 Serra Mall\nStanford, CA 94305",
                },
                {
                  icon: MessageSquare,
                  title: "Live Chat",
                  content: "Available 24/7",
                  link: "#chat",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <item.icon className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-gray-300 hover:text-blue-400 transition-colors whitespace-pre-line"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-300 whitespace-pre-line">{item.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
            <div className="flex space-x-4">
              {[
                { name: "Twitter", url: "#" },
                { name: "LinkedIn", url: "#" },
                { name: "Instagram", url: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-6 py-2"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
          style={{ perspective: 1000 }}
        >
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
            {formStatus && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-green-400"
              >
                {formStatus}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;