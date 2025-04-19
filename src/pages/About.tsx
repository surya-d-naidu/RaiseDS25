import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Users, Award, BookOpen } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-20 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About RAISE DS Conference
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The premier gathering for data science and statistics professionals, researchers, and enthusiasts.
          </p>
        </motion.div>

        {/* Conference Details */}
        <div ref={ref} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Conference Overview</h2>
            <p className="text-gray-300 mb-4">
              RAISE DS 2025 brings together the brightest minds in data science and statistics
              for three days of intensive learning, networking, and collaboration.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: Calendar, title: "Date", value: "Dec 22-24, 2025" },
                { icon: Users, title: "Attendees", value: "500+" },
                // { icon: Award, title: "Speakers", value: "75+" },
                // { icon: BookOpen, title: "Sessions", value: "100+" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-400">{stat.title}</div>
                    <div className="font-semibold">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
              alt="Conference Hall"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </motion.div>
        </div>

        {/* Topics Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Conference Topics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Probability Theory",
              },
              {
                title: "AI & Machine learning",
              },
              {
                title: "Statistical Inference",
              },
              {
                title: "Time Series Ananlysis",
              },
              {
                title: "Survey Sampling",
              },
              {
                title: "Design of experiments",
              },
              {
                title: "Statistics in Management",
              },
              {
                title: "Statistical Quality Control",
              },
              {
                title: "Geo-Spatial Statistics",
              },
              {
                title: "Distribution Theory",
              },
              {
                title: "Operations Research",
              },
              {
                title: "Applied Mathematics",
              },
              {
                title: "Population Studies",
              },
              {
                title: "Data Science Techniques",
              },
              {
                title: "Mathematical Modelling",
              },
              {
                title: "Econometrics",
              },
              {
                title: "Statistical Quality Control",
              },
              {
                title: "Stochastic Modelling",
              },
              {
                title: "Bayesian and Fuzzy statistics",
              },
              {
                title: "Bio-Statistics",
              },
              {
                title: "Agricultural Statistics",
              },
              {
                title: "Environmental Statistics",
              },
              {
                title: "Reliability and Survival Ananlysis",
              },
              {
                title: "Applied Statistics",
              },
              {
                title: "Multivariate Ananlysis",
              },
              {
                title: "Actuarial Statistics",
              },
              {
                title: "Multi-Disciplinary Research",
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Conference Schedule</h2>
          <div className="space-y-8">
            {[
              { day: "Day 1", title: "Opening Ceremony & Keynotes", time: "9:00 AM - 6:00 PM" },
              { day: "Day 2", title: "Workshops & Technical Sessions", time: "9:00 AM - 7:00 PM" },
              { day: "Day 3", title: "Industry Panels & Closing", time: "9:00 AM - 5:00 PM" },
            ].map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 rounded-xl p-6 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div>
                  <h3 className="text-xl font-semibold">{day.day}</h3>
                  <p className="text-gray-300">{day.title}</p>
                </div>
                <div className="text-blue-400">{day.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
