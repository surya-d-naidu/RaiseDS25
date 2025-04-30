import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Abstract } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { InfoIcon, AlertTriangle, FileText, CheckCircle2, Clock } from "lucide-react";
import AbstractForm from "@/components/forms/abstract-form";

export default function AbstractSubmissionPage() {
  const { user } = useAuth();
  
  const { data: abstracts, isLoading } = useQuery<Abstract[]>({
    queryKey: ["/api/abstracts"],
    enabled: !!user,
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Submit Abstract | RAISE DS 2025</title>
        <meta name="description" content="Submit your abstract for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Abstract Submission
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Share your research with the statistical community
            </p>
          </div>
          
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Abstract</TabsTrigger>
              <TabsTrigger value="my-abstracts">My Abstracts</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submit" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Your Abstract</CardTitle>
                      <CardDescription>
                        Please fill in all required fields to submit your abstract for review
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AbstractForm />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <InfoIcon className="mr-2 h-5 w-5 text-primary" />
                        Important Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Submission Deadline</p>
                            <p className="text-gray-600">October 15, 2025</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Acceptance Notification</p>
                            <p className="text-gray-600">November 10, 2025</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Abstract Format</p>
                            <p className="text-gray-600">
                              300-500 words, PDF format, including research problem, methodology, results, and conclusions
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Alert className="mt-6" variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important Note</AlertTitle>
                        <AlertDescription>
                          At least one author must register for the conference to present the paper. Abstract submissions without subsequent registration will not be included in the conference program.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Abstract Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        After submission, your abstract will go through a review process. You can check the status of your abstract in the "My Abstracts" tab.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <p><span className="font-medium">Pending:</span> Abstract is under review</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <p><span className="font-medium">Accepted:</span> Abstract has been accepted</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <p><span className="font-medium">Rejected:</span> Abstract has been rejected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="my-abstracts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Submitted Abstracts</CardTitle>
                  <CardDescription>
                    View and manage your submitted abstracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="spinner h-8 w-8 mx-auto mb-4 border-4 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-600">Loading your abstracts...</p>
                    </div>
                  ) : abstracts && abstracts.length > 0 ? (
                    <div className="space-y-6">
                      {abstracts.map((abstract) => (
                        <div key={abstract.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                            <h3 className="font-medium text-gray-900">{abstract.title}</h3>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              abstract.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              abstract.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {abstract.status.charAt(0).toUpperCase() + abstract.status.slice(1)}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Category:</span>
                              <span className="ml-2 text-sm text-gray-900">{abstract.category}</span>
                            </div>
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Keywords:</span>
                              <span className="ml-2 text-sm text-gray-900">{abstract.keywords}</span>
                            </div>
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Submitted:</span>
                              <span className="ml-2 text-sm text-gray-900">
                                {new Date(abstract.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <h4 className="text-sm font-medium text-gray-500">Abstract:</h4>
                              <p className="text-sm text-gray-900 mt-1">{abstract.content}</p>
                            </div>
                            {abstract.fileUrl && (
                              <div className="mt-4">
                                <a
                                  href={abstract.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                                >
                                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                                  View Uploaded File
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No abstracts submitted yet</h3>
                      <p className="text-gray-500 mb-4">You haven't submitted any abstracts for the conference</p>
                      <button
                        onClick={() => document.querySelector('[data-value="submit"]')?.click()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Submit an Abstract
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guidelines" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Abstract Submission Guidelines</CardTitle>
                  <CardDescription>
                    Please follow these guidelines when preparing and submitting your abstract
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-indigo max-w-none">
                    <h3>Abstract Format</h3>
                    <ul>
                      <li>Abstracts should be 300-500 words in length.</li>
                      <li>Abstracts must be written in English.</li>
                      <li>Use a clear and concise writing style.</li>
                      <li>Include 3-5 keywords that best represent the content of your research.</li>
                      <li>Full papers (if required after abstract acceptance) should be formatted according to the conference template, not exceeding 10 pages including references.</li>
                    </ul>
                    
                    <h3>Abstract Structure</h3>
                    <p>Your abstract should clearly describe:</p>
                    <ul>
                      <li><strong>Research Problem:</strong> Clearly state the problem addressed in your research and its significance.</li>
                      <li><strong>Methodology:</strong> Briefly describe the methods, techniques, or approach used in your research.</li>
                      <li><strong>Results:</strong> Summarize the main findings or outcomes of your research.</li>
                      <li><strong>Conclusions:</strong> State the implications and significance of your findings.</li>
                    </ul>
                    
                    <Separator className="my-6" />
                    
                    <h3>Review Process</h3>
                    <p>
                      All submissions will undergo a double-blind peer review process. Abstracts will be evaluated based on:
                    </p>
                    <ul>
                      <li>Originality and innovation</li>
                      <li>Relevance to the conference themes</li>
                      <li>Methodological soundness</li>
                      <li>Clarity of presentation</li>
                      <li>Potential impact and contribution to the field</li>
                    </ul>
                    
                    <h3>Presentation Types</h3>
                    <p>Based on the review results, accepted abstracts will be assigned to:</p>
                    <ul>
                      <li><strong>Oral Presentation:</strong> 15-20 minutes presentation followed by 5 minutes for questions and discussion.</li>
                      <li><strong>Poster Presentation:</strong> Interactive session where authors can discuss their research with interested attendees.</li>
                    </ul>
                    <p>Authors may indicate their preference for presentation type, but the final decision rests with the scientific committee.</p>
                    
                    <Separator className="my-6" />
                    
                    <h3>Publication Opportunities</h3>
                    <p>
                      Selected papers will be considered for publication in partner journals and conference proceedings. Authors of accepted abstracts will receive detailed information about the publication process after notification of acceptance.
                    </p>
                    
                    <Alert className="mt-6">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Important Note</AlertTitle>
                      <AlertDescription>
                        At least one author of each accepted abstract must register for the conference and present the work. Abstracts without a registered presenter will not be included in the final program.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
