import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Award, Calendar, Sparkles, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ResearchAward } from "@shared/schema";
import { format } from "date-fns";

// Utility function to format award text with proper line breaks and structure
function formatAwardText(text: string) {
  if (!text) return null;
  
  // Split by common delimiters and clean up
  const sections = text
    .split(/(?:\r?\n){2,}|(?:\. ){2,}|\s{3,}/)
    .map(section => section.trim())
    .filter(section => section.length > 0);
  
  return sections.map((section, index) => {
    // Check if this section contains bullet points or numbered lists
    const lines = section.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length > 1) {
      // This is likely a list or multiple lines
      return (
        <div key={index} className="mb-3">
          {lines.map((line, lineIndex) => {
            // Check if line starts with list indicators
            const isListItem = /^(?:[a-z]\)|[0-9]+\.|•|●|-|\*)\s/.test(line);
            const isBulletPoint = /^(?:•|●|-|\*)\s/.test(line);
            
            if (isListItem) {
              return (
                <div key={lineIndex} className="ml-2 mb-1 flex items-start">
                  {isBulletPoint && <span className="text-primary mr-2 mt-1">•</span>}
                  <span className="flex-1">{line.replace(/^(?:[a-z]\)|[0-9]+\.|•|●|-|\*)\s/, '')}</span>
                </div>
              );
            }
            
            return (
              <p key={lineIndex} className="mb-2">
                {line}
              </p>
            );
          })}
        </div>
      );
    }
    
    // Single paragraph
    return (
      <p key={index} className="mb-3">
        {section}
      </p>
    );
  });
}

// Collapsible text component for long content
function CollapsibleText({ text, maxLength = 300 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <div>{formatAwardText(text)}</div>;
  }
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded ? text : text.substring(0, maxLength) + "...";
  
  return (
    <div>
      <div>{formatAwardText(displayText)}</div>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 h-auto p-1 text-primary hover:text-primary-dark"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
      )}
    </div>
  );
}

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
            <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
              {awards.map((award) => (
                <Card key={award.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-0">
                  <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500"></div>
                  <CardHeader className="bg-gradient-to-br from-gray-50 to-white pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                          {award.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-medium">
                          {award.category}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Award className="h-8 w-8 text-amber-500" />
                        {award.value && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border border-green-200">
                            {award.value}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Award Description */}
                    {award.description && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                          Award Description
                        </h4>
                        <div className="text-gray-700">
                          <CollapsibleText text={award.description} maxLength={250} />
                        </div>
                      </div>
                    )}

                    {/* Eligibility Criteria */}
                    {award.eligibility && (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-amber-600" />
                          Eligibility Criteria
                        </h4>
                        <div className="text-gray-700">
                          <CollapsibleText text={award.eligibility} maxLength={200} />
                        </div>
                      </div>
                    )}

                    {/* Application Process */}
                    {award.applicationProcess && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-green-600" />
                          Application Process
                        </h4>
                        <div className="text-gray-700">
                          <CollapsibleText text={award.applicationProcess} maxLength={300} />
                        </div>
                      </div>
                    )}

                    {/* Award Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      {award.deadline && (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2 font-medium">Deadline:</span>
                          <Badge variant="outline" className="text-red-700 border-red-200">
                            {format(new Date(award.deadline), "dd MMM yyyy")}
                          </Badge>
                        </div>
                      )}
                      {award.value && (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2 font-medium">Value:</span>
                          <span className="text-green-700 font-semibold">{award.value}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <Separator />
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        For questions about this award or application assistance, please contact our awards committee.
                      </p>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <span className="text-gray-500 mr-2">Email:</span>
                          <span className="text-primary font-medium">awards@raiseds25.com</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Response:</span>
                          <span className="text-gray-600">Within 24-48 hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Awards Available</h3>
              <p className="text-gray-500">
                Award information will be posted here as it becomes available.
              </p>
            </div>
          )}

          {/* Additional Information */}
          <Card className="mt-12 bg-gradient-to-br from-primary to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Important Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 text-white" />
                    <h4 className="font-semibold mb-1">Application Deadline</h4>
                    <p className="text-primary-100">
                      All applications must be submitted before the specified deadline
                    </p>
                  </div>
                  <div>
                    <Award className="h-8 w-8 mx-auto mb-2 text-white" />
                    <h4 className="font-semibold mb-1">Selection Process</h4>
                    <p className="text-primary-100">
                      Awards are evaluated by a distinguished panel of experts
                    </p>
                  </div>
                  <div>
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-white" />
                    <h4 className="font-semibold mb-1">Award Ceremony</h4>
                    <p className="text-primary-100">
                      Winners will be recognized at the conference gala dinner
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
