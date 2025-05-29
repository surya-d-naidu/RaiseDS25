import { Link } from "wouter";
import { 
  CalendarDays, 
  ChevronRight
} from "lucide-react";

export default function AboutConference() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About the Conference</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Recent Advances and Innovative Statistics
          </p>
        </div>
        
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">Conference Theme</span>
              </div>
              <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
                <p>
                  This theme explores how recent advancements in statistical methods enhance data science, enabling more robust data analysis, precise forecasting, and powerful machine learning models. It delves into new statistical techniques and tools that improve data interpretation, optimization, and decision-making, shaping the future of industries through better insights and innovation.
                </p>
                <p>
                  It explores the transformative role of advanced statistics in fields such as machine learning, artificial intelligence, and big data analytics, with an emphasis on enhancing the effectiveness and efficiency of data-driven decision-making across various industries.
                </p>
              </div>
            </div>
            
            <div>
              <div className="relative h-72 bg-gradient-to-br from-primary-700 to-blue-900 rounded-xl overflow-hidden shadow-lg border border-primary-300">
                <div className="absolute inset-0">
                  <svg
                    className="w-full h-full object-cover"
                    viewBox="0 0 800 400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="800" height="400" fill="#1e40af" />
                    <g fill="#60a5fa" fillOpacity="0.4">
                      <circle cx="400" cy="200" r="80" />
                      <path d="M100,300 Q250,100 400,300 T700,300" stroke="#93c5fd" strokeWidth="4" fill="none" />
                      <path d="M100,200 Q250,0 400,200 T700,200" stroke="#dbeafe" strokeWidth="3" fill="none" />
                      <rect x="100" y="100" width="50" height="200" opacity="0.7" />
                      <rect x="170" y="150" width="50" height="150" opacity="0.7" />
                      <rect x="240" y="120" width="50" height="180" opacity="0.7" />
                      <rect x="310" y="80" width="50" height="220" opacity="0.7" />
                      <rect x="380" y="140" width="50" height="160" opacity="0.7" />
                      <rect x="450" y="90" width="50" height="210" opacity="0.7" />
                      <rect x="520" y="110" width="50" height="190" opacity="0.7" />
                      <rect x="590" y="160" width="50" height="140" opacity="0.7" />
                      <rect x="660" y="130" width="50" height="170" opacity="0.7" />
                    </g>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-600 mix-blend-multiply"></div>
                </div>
                
                {/* Workshop details */}
                <div className="relative h-full flex flex-col">
                  
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        Pre-Annual Convention Workshop
                      </h3>
                      <div className="mt-3 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-200 bg-opacity-30 backdrop-blur-sm">
                          <CalendarDays className="mr-1.5 h-4 w-4 text-blue-100" />
                          <span className="text-blue-100 font-medium">December 21, 2025</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-xl font-semibold text-white">
                          "Data Science & Machine Learning"
                        </h4>
                        <p className="mt-2 text-blue-100 text-sm">
                          An intensive one-day workshop covering advanced techniques in data analysis, 
                          statistical learning models, and hands-on machine learning applications.
                        </p>
                      </div>
                    </div>
                    
                    <Link href="/about">
                      <a className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-colors duration-200">
                        Learn more about the workshop
                        <ChevronRight className="ml-1.5 -mr-1 h-4 w-4" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CalendarDays className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p>• Abstract Submission Deadline: October 15, 2025</p>
                        <p>• Notification of Acceptance: November 10, 2025</p>
                        <p>• Early Bird Registration: Until November 30, 2025</p>
                        <p>• Workshop Day: December 21, 2025</p>
                        <p>• Main Conference: December 22-24, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
