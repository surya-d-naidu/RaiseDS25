import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, User, Briefcase } from "lucide-react";
import { InvitedSpeaker } from "@shared/schema";

export default function InvitedSpeakersCarousel() {
  const { data: speakers, isLoading } = useQuery<InvitedSpeaker[]>({
    queryKey: ["/api/invited-speakers"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Invited Speakers
            </h2>
            <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto max-w-md"></div>
          </div>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-none w-80 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!speakers || speakers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Invited Speakers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from world-renowned experts in probability, statistics, and data science
          </p>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
            {speakers.map((speaker) => (
              <Card 
                key={speaker.id} 
                className="flex-none w-80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0"
              >
                <CardContent className="p-0">
                  {/* Speaker Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-lg overflow-hidden">
                    {speaker.image ? (
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-20 w-20 text-blue-300" />
                      </div>
                    )}
                    
                    {/* Keynote badge */}
                    {speaker.isKeynote && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
                          Keynote Speaker
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Speaker Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {speaker.title} {speaker.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{speaker.position}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{speaker.institution}</span>
                      </div>
                      <div className="text-sm text-gray-500">{speaker.country}</div>
                    </div>

                    {/* Talk Title */}
                    {speaker.talkTitle && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Talk:</h4>
                        <p className="text-sm text-gray-700 italic">"{speaker.talkTitle}"</p>
                      </div>
                    )}

                    {/* Expertise */}
                    {speaker.expertise && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Expertise:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{speaker.expertise}</p>
                      </div>
                    )}

                    {/* Bio Preview */}
                    {speaker.bio && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-3">{speaker.bio}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      {speaker.websiteUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <a
                            href={speaker.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      {speaker.linkedinUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <a
                            href={speaker.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 opacity-50 hover:opacity-100 transition-opacity">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 opacity-50 hover:opacity-100 transition-opacity">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* View all speakers link */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <a href="/speakers">
              View All Speakers
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
