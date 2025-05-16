import { useState } from "react";
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
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import AbstractForm from "@/components/forms/abstract-form";

export default function AbstractSubmissionPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("submit");

  const { data: abstracts, isLoading } = useQuery<Abstract[]>({
    queryKey: ["/api/abstracts"],
    enabled: !!user,
  });

  return (
    <>
      <Helmet>
        <title>Submit Abstract | RAISE DS 2025</title>
        <meta
          name="description"
          content="Submit your abstract for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)."
        />
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-4">
                        <p>
                          <strong>Format:</strong> Your abstract should be between 300-500 words and include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Research problem/question</li>
                          <li>Methodology used</li>
                          <li>Key results</li>
                          <li>Conclusions and implications</li>
                        </ul>
                        
                        <p>
                          <strong>Markdown Formatting:</strong> You can use Markdown to format your abstract:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><code># Heading 1</code>, <code>## Heading 2</code> for headings</li>
                          <li><code>**bold**</code> for <strong>bold text</strong></li>
                          <li><code>*italic*</code> for <em>italic text</em></li>
                          <li><code>- item</code> for bullet lists</li>
                        </ul>
                        
                        <p>
                          <strong>LaTeX Support:</strong> For mathematical expressions:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Inline math: <code>$E = mc^2$</code></li>
                          <li>Display math: <code>$$F(x) = \int^a_b \frac{1}{x} dx$$</code></li>
                        </ul>
                        
                        <Alert className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Deadline</AlertTitle>
                          <AlertDescription>
                            Abstract submission deadline: September 30, 2025
                          </AlertDescription>
                        </Alert>
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
                    Track the status of your submitted abstracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                      <p className="mt-2">Loading your abstracts...</p>
                    </div>
                  ) : abstracts && abstracts.length > 0 ? (
                    <div className="space-y-6">
                      {abstracts.map((abstract) => (
                        <Card key={abstract.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 flex-1">
                              <h3 className="text-lg font-semibold mb-1">{abstract.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <FileText className="h-4 w-4 mr-1" />
                                <span>{abstract.category}</span>
                              </div>
                              <div className="prose prose-sm max-h-28 overflow-hidden">
                                <MarkdownRenderer content={abstract.content.slice(0, 200) + '...'} />
                              </div>
                            </div>
                            <div className="py-4 px-6 bg-gray-50 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l">
                              {abstract.status === "pending" ? (
                                <>
                                  <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                                  <span className="text-sm font-medium text-yellow-500">Under Review</span>
                                </>
                              ) : abstract.status === "accepted" ? (
                                <>
                                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                                  <span className="text-sm font-medium text-green-500">Accepted</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                                  <span className="text-sm font-medium text-red-500">Rejected</span>
                                </>
                              )}
                              <span className="text-xs text-gray-500 mt-1">
                                Submitted: {new Date(abstract.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No abstracts submitted</h3>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                        You haven't submitted any abstracts yet. Go to the submission form to submit your research.
                      </p>
                      <button 
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
                        onClick={() => setActiveTab("submit")}
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
                    Important information for authors
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h3>General Guidelines</h3>
                  <p>
                    The abstract should be concise and informative, containing background, methods, results, and conclusions of your research.
                    All abstracts will undergo a peer-review process by the Scientific Committee.
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <h3>Abstract Format</h3>
                  <ul>
                    <li><strong>Word limit:</strong> 300-500 words</li>
                    <li><strong>Title:</strong> Should be concise and clearly reflect the content of the abstract</li>
                    <li><strong>Authors:</strong> List all authors with their affiliations</li>
                    <li><strong>Keywords:</strong> Provide 3-5 keywords that best describe your research</li>
                    <li><strong>Formatting:</strong> Markdown and LaTeX support for equations and formatting</li>
                  </ul>
                  
                  <Separator className="my-6" />
                  
                  <h3>Selection Criteria</h3>
                  <p>
                    All submissions will undergo a double-blind peer review process. Abstracts will be evaluated based on:
                  </p>
                  <ul>
                    <li>Relevance to the conference theme and topics</li>
                    <li>Originality and innovative nature of the work</li>
                    <li>Methodological rigor</li>
                    <li>Quality of results and conclusions</li>
                    <li>Clarity of presentation</li>
                  </ul>
                  
                  <Separator className="my-6" />
                  
                  <h3>Submission Categories</h3>
                  <ul>
                    <li><strong>Probability Theory:</strong> Theoretical developments in probability</li>
                    <li><strong>Statistical Inference:</strong> Methods for estimation, hypothesis testing, etc.</li>
                    <li><strong>Statistical Computing:</strong> Algorithms and software for statistical analysis</li>
                    <li><strong>Biostatistics:</strong> Statistical methods in biological and medical research</li>
                    <li><strong>Data Science:</strong> Modern data analytics methods and applications</li>
                    <li><strong>Machine Learning:</strong> Statistical learning methods and algorithms</li>
                    <li><strong>Big Data Analytics:</strong> Methods for handling large-scale data</li>
                    <li><strong>Time Series Analysis:</strong> Analysis of temporal data</li>
                    <li><strong>Statistical Quality Control:</strong> Statistical methods for quality assurance</li>
                  </ul>
                  
                  <Alert className="mt-6">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Important Notice</AlertTitle>
                    <AlertDescription>
                      At least one author of each accepted abstract must register for the conference and present 
                      the paper in person. Abstracts without corresponding registrations will not be included 
                      in the conference program or proceedings.
                    </AlertDescription>
                  </Alert>
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
