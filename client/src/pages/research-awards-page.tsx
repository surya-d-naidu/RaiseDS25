import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Award, Calendar, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { ResearchAward } from "@shared/schema";
import { format } from "date-fns";

export default function ResearchAwardsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: awards, isLoading, error } = useQuery<ResearchAward[]>({
    queryKey: ["/api/awards"],
  });

  return (
    <>
      <Helmet>
        <title>Research Awards | RAISE DS 2025</title>
        <meta name="description" content="Learn about the research awards offered at the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Research Awards
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Recognizing excellence and innovation in statistical research
            </p>
          </div>
          
          <div className="mb-16">
            <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
              <p className="text-center">
                RAISE DS 2025 is proud to offer several prestigious awards to recognize outstanding contributions in the field of statistics and data science. These awards aim to encourage and honor researchers at various career stages who have made significant contributions to statistical theory, methodology, or applications.
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Failed to load awards. Please try again later.</p>
            </div>
          ) : awards && awards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {awards.filter(award => award.isActive).map((award) => (
                <Card key={award.id} className="bg-gradient-to-br from-primary-50 to-white">
                  <CardHeader>
                    <div className="flex justify-end items-center mb-2">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{award.title}</CardTitle>
                    <CardDescription>{award.description.split('.')[0]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">{award.description}</p>
                    <div className="space-y-2">
                      {award.amount && (
                        <div className="flex items-center">
                          <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-gray-700">Award: {award.amount}</span>
                        </div>
                      )}
                      {award.deadline && (
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-gray-700">
                            Application Deadline: {format(new Date(award.deadline), "MMMM d, yyyy")}
                          </span>
                        </div>
                      )}
                      {award.eligibility && (
                        <div className="flex items-start mt-2">
                          <Badge className="mt-1 mr-2 flex-shrink-0">Eligibility</Badge>
                          <span className="text-gray-700">{award.eligibility}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-16">
              <p className="text-lg text-gray-600">No awards are currently available. Please check back later.</p>
            </div>
          )}
          
          <Separator className="my-12" />
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Research Awards</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Failed to load awards. Please try again later.</p>
              </div>
            ) : awards && awards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {awards.filter(award => award.isActive).map((award) => (
                  <Card key={award.id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{award.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 mb-4">{award.description}</p>
                      {award.amount && (
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">Award: {award.amount}</span>
                        </div>
                      )}
                      {award.eligibility && (
                        <div className="flex items-start mb-2">
                          <Badge className="mt-1 mr-2 flex-shrink-0">Eligibility</Badge>
                          <span className="text-gray-700">{award.eligibility}</span>
                        </div>
                      )}
                      {award.deadline && (
                        <div className="flex items-center mt-4">
                          <Clock className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">Deadline: {format(new Date(award.deadline), "MMMM d, yyyy")}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No awards are currently available. Please check back later.</p>
              </div>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                To apply for a research award, please follow these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Review the eligibility criteria for the award you're interested in</li>
                <li>Prepare your application materials, including CV, research statement, and supporting documents</li>
                <li>Submit your application through the conference portal before the specified deadline</li>
                <li>Finalists may be required to present their work during a special session at the conference</li>
              </ol>
              <p className="mt-4 text-gray-600">
                For any questions regarding the research awards, please contact the Awards Committee at <span className="text-primary">awards@raiseds25.com</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
