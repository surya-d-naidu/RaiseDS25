import { BookOpen, Award, ExternalLink } from "lucide-react";

export default function PublicationSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Publication Opportunity
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Selected papers from RAISE DS 2025 will have the prestigious opportunity to be published
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Boletim da Sociedade Paranaense de Matemática
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  High-quality papers presented at the conference will be considered for publication in the 
                  <span className="font-semibold text-blue-700"> Boletim da Sociedade Paranaense de Matemática</span>, 
                  a renowned journal in the field of mathematics and statistics.
                </p>
                <p className="text-base text-gray-500 mb-6">
                  This presents an excellent opportunity for researchers to showcase their work in a peer-reviewed 
                  international publication and gain recognition in the global academic community.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a 
                    href="https://periodicos.uem.br/ojs/index.php/BSocParanMat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Journal Website
                  </a>
                  <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Peer-Reviewed Publication
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Selection Process</h4>
                  <p className="text-sm text-blue-700">
                    Papers will be selected based on quality, originality, and relevance to the conference themes
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Peer Review</h4>
                  <p className="text-sm text-green-700">
                    All selected papers undergo rigorous peer review process ensuring high publication standards
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">International Reach</h4>
                  <p className="text-sm text-purple-700">
                    Published papers gain international visibility and recognition in the academic community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            More details about the submission and selection process will be shared with conference participants
          </p>
        </div>
      </div>
    </div>
  );
}
