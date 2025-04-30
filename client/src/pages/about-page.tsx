import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck, MapPin, School, Building2, Users } from "lucide-react";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About | RAISE DS 2025</title>
        <meta name="description" content="Learn about the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About RAISE DS 2025
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in Conjunction with International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science
            </p>
          </div>
          
          <div className="mb-16">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">Conference Overview</span>
              </div>
            </div>
            
            <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
              <p>
                The International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS) serves as a platform for researchers, academics, and industry professionals to share their expertise, research findings, and innovations in the fields of statistics and data science.
              </p>
              <p>
                In conjunction with the 45th Annual Convention of the Indian Society for Probability and Statistics (ISPS), this conference brings together the brightest minds from around the world to explore the latest advancements in statistical methods and their applications in enhancing data science.
              </p>
              <p>
                Through keynote speeches, panel discussions, paper presentations, and interactive sessions, participants will gain insights into cutting-edge research, foster collaborations, and contribute to the advancement of statistical sciences.
              </p>
            </div>
          </div>
          
          <div className="mb-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="h-48 bg-primary-100 relative">
                  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                    <rect width="800" height="400" fill="#dbeafe" />
                    <g fill="#60a5fa" fillOpacity="0.4">
                      <path d="M50,250 Q200,50 350,250 T650,250" stroke="#93c5fd" strokeWidth="5" fill="none" />
                      <path d="M50,200 Q200,0 350,200 T650,200" stroke="#2563eb" strokeWidth="3" fill="none" />
                      <circle cx="200" cy="150" r="30" />
                      <circle cx="400" cy="200" r="50" />
                      <circle cx="600" cy="150" r="40" />
                      <rect x="150" y="250" width="100" height="100" />
                      <rect x="350" y="250" width="100" height="100" />
                      <rect x="550" y="250" width="100" height="100" />
                    </g>
                  </svg>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <CalendarCheck className="mr-2 h-6 w-6 text-primary" />
                    Conference Theme
                  </h2>
                  <p className="text-gray-600">
                    This theme explores how recent advancements in statistical methods enhance data science, enabling more robust data analysis, precise forecasting, and powerful machine learning models. It delves into new statistical techniques and tools that improve data interpretation, optimization, and decision-making, shaping the future of industries through better insights and innovation.
                  </p>
                  <p className="text-gray-600 mt-4">
                    It explores the transformative role of advanced statistics in fields such as machine learning, artificial intelligence, and big data analytics, with an emphasis on enhancing the effectiveness and efficiency of data-driven decision-making across various industries.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 bg-secondary-100 relative">
                  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                    <rect width="800" height="400" fill="#f5f3ff" />
                    <g fill="#a78bfa" fillOpacity="0.4">
                      <circle cx="400" cy="200" r="150" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                      <circle cx="400" cy="200" r="100" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                      <circle cx="400" cy="200" r="50" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                      <line x1="250" y1="200" x2="550" y2="200" stroke="#8b5cf6" strokeWidth="2" />
                      <line x1="400" y1="50" x2="400" y2="350" stroke="#8b5cf6" strokeWidth="2" />
                      <circle cx="300" cy="150" r="10" />
                      <circle cx="450" cy="250" r="15" />
                      <circle cx="500" cy="150" r="12" />
                      <circle cx="350" cy="300" r="8" />
                    </g>
                  </svg>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="mr-2 h-6 w-6 text-secondary" />
                    Key Information
                  </h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Dates:</span>
                      <span>December 22-24, 2025 (Main Conference)<br />December 21, 2025 (Pre-Convention Workshop)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Location:</span>
                      <span>VIT-AP University, Amaravati, Andhra Pradesh, India</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Workshop:</span>
                      <span>"Data Science & Machine Learning" (for ISPS Members)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">Organized by:</span>
                      <span>Department of Mathematics, School of Advanced Sciences, VIT-AP University & Indian Society for Probability and Statistics (ISPS)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator className="my-16" />
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">About the Hosts</h2>
            
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <div className="flex items-center mb-4">
                  <School className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">About VIT-AP University</h3>
                </div>
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    VIT-AP University, located in the city of Amaravati, Andhra Pradesh, is renowned for its commitment to innovation and academic distinction. As part of the prestigious VIT group, with a legacy spanning over 40 years, VIT-AP offers a unique blend of rigorous academics, state-of-the-art facilities, and opportunities for holistic development.
                  </p>
                  <p>
                    With a strong emphasis on ethical values, sustainability, and inclusivity, the university nurtures well-rounded individuals to make a positive impact on society. VIT-AP attracts students from across the globe, providing them with a vibrant and supportive environment.
                  </p>
                  <p>
                    Guided by the motto "Apply Knowledge. Improve Life!", VIT-AP University remains dedicated to transforming education into a tool for societal advancement.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-secondary mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">About the School of Advanced Sciences</h3>
                </div>
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    The School of Advanced Sciences (SAS) at VIT-AP University comprises the Departments of Mathematics, Physics, and Chemistry, with over 110 faculty members. SAS fosters a dynamic learning environment through project-based learning (PBL), promoting critical thinking, research, and innovation.
                  </p>
                  <p>
                    The school equips students with a strong foundation in natural sciences while encouraging exploration of modern technological and statistical advancements. With a vision for leadership in research and technology development, SAS VIT-AP aims to produce skilled professionals prepared to tackle current and future challenges.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">About Indian Society for Probability and Statistics (ISPS)</h3>
                </div>
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    The Indian Society for Probability and Statistics (ISPS) is a premier organization dedicated to the advancement of statistical sciences in India. Through its annual conventions, workshops, and publications, ISPS provides a platform for academic exchange, professional development, and networking among statisticians, mathematicians, and data scientists.
                  </p>
                  <p>
                    Founded with the mission to promote research and education in probability and statistics, ISPS plays a crucial role in shaping the future of statistical sciences in India and beyond.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <MapPin className="h-8 w-8 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">About the City of Victory - Vijayawada</h3>
                </div>
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    Vijayawada, in Andhra Pradesh, is a vibrant city known for its rich cultural heritage and economic importance. Dubbed the "City of Victory," it lies on the banks of the Krishna River and serves as a key commercial hub for South India.
                  </p>
                  <p>
                    Notable landmarks include the iconic Kanaka Durga Temple, a major pilgrimage site, and the Undavalli Caves, renowned for their stunning rock-cut architecture. With a robust economy driven by agriculture, trade, and industry, Vijayawada is also home to a growing infrastructure in education and healthcare.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Who can attend the conference?</h3>
                <p className="text-gray-600">
                  The conference is open to researchers, academicians, professionals, and students from the fields of statistics, mathematics, data science, and related disciplines. Anyone with an interest in statistical methods and their applications is welcome to participate.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How can I register for the conference?</h3>
                <p className="text-gray-600">
                  Registration can be completed online through our registration portal. Visit the Register page for more information on registration fees, deadlines, and the registration process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can I present my research at the conference?</h3>
                <p className="text-gray-600">
                  Yes, the conference welcomes abstract submissions for oral and poster presentations. Visit the Call for Papers page for submission guidelines, important dates, and the review process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is there an accommodation arrangement for participants?</h3>
                <p className="text-gray-600">
                  The conference has partnered with local hotels to provide discounted rates for participants. Information on accommodation options will be available on the website closer to the event date. Participants are encouraged to book early.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Will the conference proceedings be published?</h3>
                <p className="text-gray-600">
                  Yes, selected papers presented at the conference will be considered for publication in partner journals and conference proceedings. Detailed information will be provided to authors whose abstracts are accepted.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How can I contact the organizers?</h3>
                <p className="text-gray-600">
                  For general inquiries, you can contact the conference secretariat at raiseds25@vitap.ac.in. For specific queries, please refer to the contact information of the conveners and organizing team members on the Committee page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
