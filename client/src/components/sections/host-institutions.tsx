import { Building, Users } from "lucide-react";

export default function HostInstitutions() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Host Institutions</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Jointly Organized By
          </p>
        </div>
        
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Building className="h-10 w-10 text-primary" />
                  </div>
                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center">RMIT University</h3>
                <p className="mt-4 text-gray-600">
                  RMIT University is a global university of technology, design and enterprise. With a focus on practical education and innovative research, RMIT provides expertise in materials science and sustainable technology solutions. The university's international collaboration brings global perspectives to addressing water and energy challenges.
                </p>
                <p className="mt-2 text-gray-600">
                  Through this partnership, RMIT contributes to advancing sustainable materials research and fostering international academic collaboration in addressing critical environmental challenges.
                </p>
                <div className="mt-6 text-center">
                  <a href="https://vitap.ac.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-primary-700">
                    Visit website
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center">Department of Chemistry, SAS</h3>
                <p className="mt-4 text-gray-600">
                  The Department of Chemistry at the School of Advanced Sciences (SAS) is dedicated to advancing chemical sciences and fostering innovation in sustainable materials research. Through cutting-edge research and academic excellence, the department provides a platform for scientific exchange and professional development.
                </p>
                <p className="mt-2 text-gray-600">
                  With a focus on addressing urgent challenges in water and energy through innovative chemistry applications, the department plays a crucial role in shaping the future of sustainable materials science.
                </p>
                <div className="mt-6 text-center">
                  <a href="#" className="inline-flex items-center text-secondary hover:text-secondary-700">
                    Learn more
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
