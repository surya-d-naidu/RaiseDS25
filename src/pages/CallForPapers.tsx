import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';

const CallForPapers = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Example dates
  const importantDates = [
    { label: 'Paper Submission Opens', date: 'June 1, 2025' },
    { label: 'Abstract Deadline', date: 'July 15, 2025' },
    { label: 'Full Paper Deadline', date: 'August 31, 2025' },
    { label: 'Notification of Acceptance', date: 'September 30, 2025' },
    { label: 'Camera-Ready Submission', date: 'October 15, 2025' },
    { label: 'Conference Dates', date: 'December 22–24, 2025' },
  ];

  const topics = ["Probability Theory",
    "AI & Machine learning",
    "Statistical Inference",
    "Time Series Ananlysis",
    "Survey Sampling",
    "Planning and Experimental Designs", 
    "Statistics in Management", 
    "Statistical Quality Control",
    "Geo-Spatial Statistics",
    "Distribution Theory",
    "Operations Research",
    "Applied Mathematics",
    "Population Studies",
    "Data Science Techniques",
    "Mathematical Modelling",
    "Econometrics",
    "Statistical Quality Control",
    "Stochastic Modelling",
    "Bayesian and Fuzzy statistics",
    "Bio-Statistics",
    "Agricultural Statistics",
    "Environmental Statistics",
    "Reliability and Survival Ananlysis",
    "Applied Statistics",
    "Multivariate Ananlysis",
    "Actuarial Statistics",
    "Multi-Disciplinary Research",
  ];

  return (
    <div className="relative bg-gradient-to-b from-blue-900/20 to-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/90" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Call for Papers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-8"
          >
            We invite researchers and practitioners to submit original contributions on the latest advancements in data science, statistics, and AI.
          </motion.p>
          <motion.a
            href="#dates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          >
            View Important Dates
          </motion.a>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Important Dates */}
      <section id="dates" ref={ref} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Important Dates
          </motion.h2>
          <p className="text-gray-300">
            Mark your calendars and plan your submissions accordingly.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {importantDates.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-white/5 rounded-xl p-6 text-center"
            >
              <div className="text-lg font-semibold mb-2 text-blue-400">{item.label}</div>
              <div className="text-2xl font-bold">{item.date}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topics of Interest */}
      <section className="py-20 px-4 bg-gradient-to-br from-black to-blue-900/20">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Topics of Interest
          </motion.h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We welcome submissions on (but not limited to) the following themes:
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
            >
              <p className="text-gray-200 font-medium">{topic}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-6"
          >
            Submission Guidelines
          </motion.h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>• All submissions must be in English and formatted according to the IEEE conference template.</p>
            <p>• Maximum length: 8 pages (including references).</p>
            <p>• Submissions should include abstract, keywords, methodology, results, and references.</p>
            <p>• Papers must be submitted electronically through the conference submission portal.</p>
            <p>• At least one author of each accepted paper must register and present at the conference.</p>
          </div>
        </div>
      </section>

      {/* Review Process */}
      <section className="py-20 px-4 bg-gradient-to-br from-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-3xl md:text-4xl font-bold mb-4">
            Review Process
          </motion.h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            All submissions undergo a rigorous double-blind peer review to ensure quality and relevance.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-gray-300">
          <p>1. Initial check for formatting and scope compliance.</p>
          <p>2. Double-blind review by at least three experts.</p>
          <p>3. Consolidated feedback provided to authors.</p>
          <p>4. Final decision communicated by notification date.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl md:text-4xl font-bold mb-4">
            Contact Us
          </motion.h2>
          <p className="text-gray-300 mb-8">
            For inquiries, please reach out to the Program Chairs:
          </p>
          <div className="space-y-4 text-gray-300">
            <p><strong>Prof. Vasli Nagarjuna</strong> – inki@pinki.ponki</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CallForPapers;
