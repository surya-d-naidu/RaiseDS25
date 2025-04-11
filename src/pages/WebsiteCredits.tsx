import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WebsiteCredits = () => {

  return (
    <div>
        <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
            >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Website Credits
            </h1>
            <p className="text-gray-300">
                Acknowledgments and credits for the website.
                
            </p>
            </motion.div>
        </div>
    </div>
  );
};

export default WebsiteCredits;