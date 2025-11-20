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
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About SuWatE+'26</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sustainable Materials for Water and Energy Solutions
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
                  Addressing the urgent challenges of water and energy requires the innovative use of chemistry. The proposed International Conference on Next Generation Sustainable Materials for Water and Energy Solutions - 2026 (SuWatE+'26) aims to bring together diverse branches of chemistry, materials science, chemical and mechanical engineering and computational studies to further advance this dynamic field of research.
                </p>
                <p>
                  Our conference aims to foster discussions and innovative solutions by exploring the current fundamental understanding of chemistry to address energy and water challenges. Additionally, we will focus on enhancing light-matter interactions, designing and synthesizing novel materials, and employing in-situ techniques to study chemical processes for water and energy solutions.
                </p>
              </div>
            </div>
            
            <div>
              <div className="relative h-64 bg-primary rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0">
                  <svg
                    className="w-full h-full object-cover"
                    viewBox="0 0 800 400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="800" height="400" fill="#1B5E20" />
                    <g fill="#43A047" fillOpacity="0.6">
                      {/* Benzene rings */}
                      <g transform="translate(150,120)">
                        <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" stroke="#81C784" strokeWidth="2" fill="none" />
                        <circle cx="0" cy="-30" r="4" fill="#81C784" />
                        <circle cx="26" cy="-15" r="4" fill="#81C784" />
                        <circle cx="26" cy="15" r="4" fill="#81C784" />
                        <circle cx="0" cy="30" r="4" fill="#81C784" />
                        <circle cx="-26" cy="15" r="4" fill="#81C784" />
                        <circle cx="-26" cy="-15" r="4" fill="#81C784" />
                      </g>
                      
                      {/* Water molecules H2O */}
                      <g transform="translate(400,80)">
                        <circle cx="0" cy="0" r="12" fill="#1976D2" />
                        <circle cx="-18" cy="-12" r="6" fill="#42A5F5" />
                        <circle cx="18" cy="-12" r="6" fill="#42A5F5" />
                        <line x1="0" y1="0" x2="-18" y2="-12" stroke="#42A5F5" strokeWidth="2" />
                        <line x1="0" y1="0" x2="18" y2="-12" stroke="#42A5F5" strokeWidth="2" />
                      </g>
                      
                      {/* Solar panel representation */}
                      <g transform="translate(600,150)">
                        <rect x="-25" y="-15" width="50" height="30" fill="#2E7D32" stroke="#43A047" strokeWidth="1" />
                        <line x1="-25" y1="0" x2="25" y2="0" stroke="#43A047" strokeWidth="1" />
                        <line x1="0" y1="-15" x2="0" y2="15" stroke="#43A047" strokeWidth="1" />
                      </g>
                      
                      {/* Graphene lattice structure */}
                      <g transform="translate(200,280)">
                        <polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" stroke="#81C784" strokeWidth="1.5" fill="none" />
                        <polygon points="34,-10 51,0 51,20 34,30 17,20 17,0" stroke="#81C784" strokeWidth="1.5" fill="none" />
                        <polygon points="-34,-10 -17,0 -17,20 -34,30 -51,20 -51,0" stroke="#81C784" strokeWidth="1.5" fill="none" />
                        <circle cx="0" cy="-20" r="3" fill="#2E7D32" />
                        <circle cx="17" cy="-10" r="3" fill="#2E7D32" />
                        <circle cx="17" cy="10" r="3" fill="#2E7D32" />
                        <circle cx="0" cy="20" r="3" fill="#2E7D32" />
                        <circle cx="-17" cy="10" r="3" fill="#2E7D32" />
                        <circle cx="-17" cy="-10" r="3" fill="#2E7D32" />
                      </g>
                      
                      {/* Energy flow waves */}
                      <path d="M50,200 Q200,150 350,200 T650,200" stroke="#81C784" strokeWidth="3" fill="none" opacity="0.7" />
                      <path d="M50,250 Q200,200 350,250 T650,250" stroke="#43A047" strokeWidth="2" fill="none" opacity="0.5" />
                      
                      {/* Wind turbine blades */}
                      <g transform="translate(500,300)">
                        <circle cx="0" cy="0" r="15" stroke="#81C784" strokeWidth="2" fill="none" />
                        <line x1="0" y1="0" x2="0" y2="-15" stroke="#81C784" strokeWidth="2" />
                        <line x1="0" y1="0" x2="13" y2="7.5" stroke="#81C784" strokeWidth="2" />
                        <line x1="0" y1="0" x2="-13" y2="7.5" stroke="#81C784" strokeWidth="2" />
                      </g>
                      
                      {/* Battery representation */}
                      <g transform="translate(700,100)">
                        <rect x="-15" y="-20" width="30" height="40" fill="#2E7D32" stroke="#43A047" strokeWidth="1" />
                        <rect x="-10" y="-15" width="20" height="30" fill="#43A047" />
                        <rect x="-2" y="-25" width="4" height="5" fill="#43A047" />
                      </g>
                    </g>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-multiply"></div>
                </div>
                <div className="relative px-6 py-4 h-full flex flex-col justify-end">
                  <h3 className="text-lg font-semibold text-white">Hybrid Conference Mode</h3>
                  <p className="text-primary-100 text-sm mt-1">In association with RMIT University</p>
                  <Link href="/about">
                    <a className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-secondary hover:bg-secondary/90">
                      Learn more
                      <ChevronRight className="ml-1 -mr-0.5 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p>• Abstract Submission Opens: November 1, 2026</p>
                        <p>• Abstract Submission Closes: January 31, 2026</p>
                        <p>• Acceptance Notification: February 1, 2026</p>
                        <p>• Early Bird Registration: Until January 15, 2026</p>
                        <p>• Main Conference: February 19-21, 2026</p>
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
