import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Filter,
  Tag,
  Download
} from "lucide-react";

export default function CallForPapersPage() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Delay scrolling slightly to ensure the page is fully loaded
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Call for Papers | RAISE DS 2025</title>
        <meta name="description" content="Submit your abstract for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Call for Papers
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Share your research and innovations with the global statistical community
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FileText className="mr-2 h-6 w-6 text-primary" />
                    Abstract Submission Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-indigo max-w-none">
                    <p>
                      We invite researchers, academics, and professionals to submit abstracts for oral and poster presentations at the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) in conjunction with the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS).
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-900 flex items-center mt-6">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Abstract Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li>Abstracts should be 300-500 words, clearly describing the research problem, methodology, results, and conclusions.</li>
                      <li>Include 3-5 keywords that best represent the content of your research.</li>
                      <li>Submissions must be in English and in PDF format.</li>
                      <li>Full papers (if required after abstract acceptance) should be formatted according to the conference template, not exceeding 10 pages including references.</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 flex items-center mt-6">
                      <Filter className="mr-2 h-5 w-5 text-blue-500" />
                      Review Process
                    </h3>
                    <p>
                      All submissions will undergo a double-blind peer review process. Abstracts will be evaluated based on originality, relevance to the conference themes, methodological soundness, and potential impact. Authors will be notified of the review results by November 10, 2025.
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-900 flex items-center mt-6">
                      <Tag className="mr-2 h-5 w-5 text-purple-500" />
                      Presentation Formats
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li><strong>Oral Presentations:</strong> 15-20 minutes for presentation followed by a 5-minute discussion.</li>
                      <li><strong>Poster Presentations:</strong> Interactive session where authors can discuss their research with interested attendees.</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium text-gray-900 flex items-center mt-6">
                      <CheckCircle className="mr-2 h-5 w-5 text-amber-500" />
                      Publication Opportunities
                    </h3>
                    <p>
                      Selected papers will be considered for publication in partner journals and conference proceedings. Authors of accepted abstracts will receive detailed information about the publication process after notification of acceptance.
                    </p>
                    
                    <div className="mt-8 flex justify-center">
                      <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <Download className="mr-2 h-4 w-4" />
                        Download Submission Template
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="conference-themes">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Tag className="mr-2 h-6 w-6 text-primary" />
                    Conference Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-indigo max-w-none">
                    <p>
                      The conference welcomes submissions in, but not limited to, the following areas:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                      <div>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Probability Theory</li>
                          <li>AI & Machine Learning</li>
                          <li>Statistical Inference</li>
                          <li>Time Series Analysis</li>
                          <li>Survey Sampling</li>
                          <li>Planning and Experimental Designs</li>
                          <li>Statistics in Management</li>
                          <li>Statistical Quality Control</li>
                          <li>Spatial Statistics</li>
                        </ul>
                      </div>
                      
                      <div>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Distribution Theory</li>
                          <li>Operations Research</li>
                          <li>Applied Mathematics</li>
                          <li>Population Studies</li>
                          <li>Data Science Techniques</li>
                          <li>Mathematical Modelling</li>
                          <li>Econometrics</li>
                          <li>Stochastic Modelling</li>
                          <li>Bayesian and Fuzzy Statistics</li>
                        </ul>
                      </div>
                      
                      <div>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Bio-Statistics</li>
                          <li>Agricultural Statistics</li>
                          <li>Environmental Statistics</li>
                          <li>Reliability and Survival Analysis</li>
                          <li>Applied Statistics</li>
                          <li>Multivariate Analysis</li>
                          <li>Actuarial Statistics</li>
                          <li>Official Statistics</li>
                          <li>Multi-Disciplinary Research</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Abstract Submission Deadline</p>
                        <p className="text-gray-600">October 15, 2025</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Notification of Acceptance</p>
                        <p className="text-gray-600">November 10, 2025</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Early Bird Registration</p>
                        <p className="text-gray-600">Until November 30, 2025</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Workshop Day</p>
                        <p className="text-gray-600">December 21, 2025</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Main Conference</p>
                        <p className="text-gray-600">December 22-24, 2025</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    Submission Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    To submit your abstract, please follow these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-600 mb-6">
                    <li>Create an account or log in to the conference portal</li>
                    <li>Navigate to the "Submit Abstract" page</li>
                    <li>Fill in the required information and upload your abstract</li>
                    <li>Review your submission and click "Submit"</li>
                  </ol>
                  <div className="flex justify-center">
                    <Link href={user ? "/abstracts/submit" : "/auth"}>
                      <Button className="w-full">
                        {user ? "Submit Abstract" : "Sign In to Submit"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    For any queries regarding abstract submission, please contact:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li>
                      <p className="font-semibold">Dr. Vasili B V Nagarjuna</p>
                      <p>Convener</p>
                      <p>nagarjuna.vasili@vitap.ac.in</p>
                      <p>+91-7673944853</p>
                    </li>
                    <li>
                      <p className="font-semibold">Dr. Vemula Ramakrishna Reddy</p>
                      <p>Co-convener</p>
                      <p>ramakrishna.reddy@vitap.ac.in</p>
                      <p>+91 91330 73225</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
