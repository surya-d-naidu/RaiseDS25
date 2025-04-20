import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Brain, LineChart, Users, Laptop, Building, Award, BookOpen, FlaskConical, BookOpenCheck, Users2, Lightbulb } from 'lucide-react';
import Vishnu from '../assets/Prof._R_VishnuVardhan.jpg';
import Reddy from '../assets/Prof._RajaSekharReddy.jpg';
import Vasili from '../assets/Vasili.jpg';
import Siva from '../assets/Siva.jpg';
import Vitap from '../assets/vitap-drone.jpeg';
import VitapSmall from '../assets/small.jpg';
import Earth from '../assets/background.jpg';
import VitLogo from '../assets/VIT-AP-1024x423.png';
import ISPSLogo from '../assets/ISPS-LOGO-622x622.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // for styling
import 'slick-carousel/slick/slick-theme.css'; // for theme

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const partners = [
    { name: "Microsoft", logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80" },
    { name: "Google", logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80" },
    { name: "Amazon", logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&q=80" },
    { name: "IBM", logo: "https://images.unsplash.com/photo-1642787982798-0596ee0e0647?auto=format&fit=crop&q=80" },
    { name: "Oracle", logo: "https://images.unsplash.com/photo-1607004468138-e7e23ea26947?auto=format&fit=crop&q=80" },
  ];

  // Countdown Timer Code
  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-12-22T00:00:00');
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    let timeLeft = {} as {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default setting for larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Keep the same number of slides to show on medium and large screens for consistency
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2, // Adjust to 2 on smaller screens
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Reduce to 1 for smallest screens
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black/80" />
        <img
    src={Earth}
    alt="Earth Background"
    className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
  />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
      {/* Logos section */}
      <div className="flex justify-center gap-8 mb-6">
        <motion.img
          src={ISPSLogo}
          alt="Logo 1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-full object-cover bg-white"
        />
        <motion.img
          src={VitLogo}
          alt="Logo 2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-full object-cover bg-white"
        />
        <motion.img
          src="/path-to-logo3.png"
          alt="Logo 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-full object-cover bg-white"
        />
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
      >
        RAISE DS 2025: Shaping the Future of Data Science & Statistics
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl md:text-2xl text-gray-300 mb-8"
      >
        Join the most innovative minds in the world of Data Science and Statistics
      </motion.p>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex justify-center space-x-4 text-white font-mono text-3xl mb-8"
      >
        <div>
          <span className="block">{timeLeft.days || 0}</span>
          <span className="text-sm">Days</span>
        </div>
        <div>
          <span className="block">{timeLeft.hours || 0}</span>
          <span className="text-sm">Hours</span>
        </div>
        <div>
          <span className="block">{timeLeft.minutes || 0}</span>
          <span className="text-sm">Minutes</span>
        </div>
        <div>
          <span className="block">{timeLeft.seconds || 0}</span>
          <span className="text-sm">Seconds</span>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a
          href="/signup"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity slide-left"
        >
          Sign Up
        </a>
        <a
          href="#about"
          className="px-8 py-3 border border-blue-500 rounded-full text-blue-400 font-semibold hover:bg-blue-500/10 transition-colors slide-right"
        >
          Learn More
        </a>
      </motion.div>
    </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>
    

      {/* About Conference Section */}
      <section id="about" ref={ref} className="py-20 px-4 bg-gradient-to-b from-black to-yellow-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About the Conference
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              This theme explores how recent advancements in statistical methods enhance the data  science, enabling more 
              robust data analysis, precise forecasting, and powerful machine  learning models. It delves into new statistical 
              techniques and tools that improve data  interpretation, optimization, and decision-making, shaping the future of 
              industries through  better insights and innovation. It explores the transformative role of advanced statistics in  
              fields such as machine learning, artificial intelligence, and big data analytics, with an  emphasis on enhancing the 
              effectiveness and efficiency of data-driven decision-making  across various industries.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Machine Learning",
                description: "Cutting-edge ML algorithms and applications",
              },
              {
                icon: LineChart,
                title: "Data Visualization",
                description: "Interactive and immersive data storytelling",
              },
              {
                icon: Users,
                title: "Networking",
                description: "Connect with industry leaders and peers",
              },
              {
                icon: Laptop,
                title: "Workshops",
                description: "Hands-on coding sessions and case studies",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* University Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VITAP University
              </h2>
              <p className="text-gray-300 text-lg">
              VIT-AP University, located in the city of Amaravati, Andhra Pradesh, is renowned for 
              its  commitment to innovation and academic distinction. As part of the prestigious VIT 
              group,  with a legacy spanning over 40 years, VIT-AP offers a unique blend of rigorous 
              academics,  state-of-the-art facilities, and opportunities for holistic development. With a 
              strong  emphasis on ethical values, sustainability, and inclusivity, the university 
              nurtures well rounded individuals to make a positive impact on society. VIT-AP attracts 
              students from across the globe, providing them with a vibrant and supportive  
              environment. Guided by the motto Apply Knowledge. Improve Life!, VIT-AP 
              University remains dedicated  to transforming education into a tool for societal 
              advancement. Visit vitap.ac.in to learn more.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Building, title: "Research Centers", value: "50+" },
                  { icon: Award, title: "Awards", value: "35+" },
                  { icon: BookOpen, title: "Publications", value: "1000+" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white/5 rounded-xl p-4 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.title}</div>
                  </motion.div>
                ))}
              </div>
              <ul className="space-y-3">
                {[
                  "World-class research facilities and laboratories",
                  "Collaborative environment for innovation",
                  "Rich history of technological breakthroughs",
                  "Strong industry partnerships",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-300"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  
                    src={Vitap}
                    alt="VITAP University Campus"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden">
                <img
                  src={VitapSmall}
                  alt="VITAP University Detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-black via-blue-950 to-blue-900 text-white overflow-hidden">
      {/* Section Background Blurs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Heading and Intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            School of Advanced Sciences
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Empowering future scientists and innovators through interdisciplinary learning,
            cutting-edge research, and a passion for discovery.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-200 text-lg leading-relaxed"
          >
            <p className="mb-6">
              The School of Advanced Sciences (SAS) at VIT-AP University is home to the 
              Departments of Mathematics, Physics, and Chemistry, with a diverse faculty of 
              over 110 members. SAS fosters a collaborative learning environment rooted in 
              project-based learning (PBL), encouraging students to think critically, experiment, 
              and lead with innovation.
            </p>
            <p>
              Students gain a strong foundation in core sciences while exploring modern 
              advancements in technology and statistics. SAS aims to shape future leaders in 
              research and development, equipping them with skills to meet global challenges 
              head-on.
            </p>
          </motion.div>

          {/* Icon Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                icon: FlaskConical,
                title: "Research-Driven",
                desc: "Pioneering research in core and applied sciences.",
              },
              {
                icon: BookOpenCheck,
                title: "Project-Based Learning",
                desc: "Hands-on approach to build real-world problem solvers.",
              },
              {
                icon: Users2,
                title: "Diverse Faculty",
                desc: "110+ experts from academia and research industries.",
              },
              {
                icon: Lightbulb,
                title: "Innovation-Focused",
                desc: "Encouraging creative exploration and new ideas.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 p-5 rounded-xl shadow hover:bg-white/10 transition duration-300"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-xl font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

      {/* Speakers Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-900/20 to-black">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Featured Speakers</h2>
    <div className="-mx-4"> {/* Ensures consistent spacing between slides */}
      <Slider {...settings}>
        {[
          {
            name: "Prof. P Raja Sekhar Reddy",
            role: "Hon. President ISPS",
            image: Reddy,
            description: "Leading expert in quantitative research and data analysis"
          },
          {
            name: "Prof. R Vishnu Vardhan",
            role: "Data Doctor and Bio-Statistician",
            image: Vishnu,
            description: "Leading expert in deep learning and neural networks"
          },
          {
            name: "Dr. Vasili B V Nagarjuna",
            role: "Convener",
            image: Vasili,
            description: "Specialist in MLOps and scalable AI systems"
          },
          {
            name: "Dr. Siva G",
            role: "Org. Secretary",
            image: Siva,
            description: "Specialist in MLOps and scalable AI systems"
          }
        ].map((speaker, index) => (
          <div key={index} className="px-4">
            <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
              <div className="relative h-64">
                <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{speaker.name}</h3>
                <p className="text-blue-400 mb-2">{speaker.role}</p>
                <p className="text-gray-400">{speaker.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </div>
</section>

      {/* Strategic Partners Section (at Bottom) */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
