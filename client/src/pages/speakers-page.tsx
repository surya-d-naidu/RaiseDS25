import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, User, Briefcase, Calendar, ChevronLeft } from "lucide-react";
import { InvitedSpeaker } from "@shared/schema";
import { Link } from "wouter";

export default function SpeakersPage() {
  const { data: speakers, isLoading } = useQuery<InvitedSpeaker[]>({
    queryKey: ["/api/invited-speakers"],
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Invited Speakers - RAISE DS 2025</title>
          <meta name="description" content="Meet our distinguished invited speakers for RAISE DS 2025 conference" />
        </Helmet>
        
        <Navbar />
        
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 animate-pulse rounded mx-auto max-w-md mb-4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded mx-auto max-w-2xl"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  const keynoteSpeakers = speakers?.filter(speaker => speaker.isKeynote) || [];
  const invitedSpeakers = speakers?.filter(speaker => !speaker.isKeynote) || [];

  return (
    <>
      <Helmet>
        <title>Invited Speakers - RAISE DS 2025</title>
        <meta name="description" content="Meet our distinguished invited speakers for RAISE DS 2025 conference" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
                <Link href="/">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Invited Speakers
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Learn from world-renowned experts in probability, statistics, and data science at RAISE DS 2025
              </p>
              <div className="mt-6 flex justify-center items-center space-x-6 text-primary-foreground/80">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>December 2025</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>45th Annual Convention ISPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Keynote Speakers */}
          {keynoteSpeakers.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Keynote Speakers
                </h2>
                <p className="text-lg text-gray-600">
                  Distinguished leaders presenting the latest advances in their fields
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {keynoteSpeakers.map((speaker) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} />
                ))}
              </div>
            </section>
          )}

          {/* Invited Speakers */}
          {invitedSpeakers.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Invited Speakers
                </h2>
                <p className="text-lg text-gray-600">
                  Expert researchers sharing insights and innovations
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {invitedSpeakers.map((speaker) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} />
                ))}
              </div>
            </section>
          )}

          {/* No Speakers Message */}
          {(!speakers || speakers.length === 0) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary/60" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Speakers Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're currently finalizing our lineup of distinguished speakers. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Custom styles for text truncation */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
          .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </>
  );
}

interface SpeakerCardProps {
  speaker: InvitedSpeaker;
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group">
      <CardContent className="p-0">
        {/* Speaker Image */}
        <div className="relative h-64 bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden flex items-center justify-center">
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={speaker.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-20 w-20 text-primary/40" />
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
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Speaker Info */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {speaker.title} {speaker.name}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{speaker.position}</span>
            </div>
            <div className="flex items-start text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">{speaker.institution}</div>
                <div className="text-gray-500">{speaker.country}</div>
              </div>
            </div>
          </div>

          {/* Talk Title */}
          {speaker.talkTitle && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
              <h4 className="text-sm font-semibold text-primary mb-1">Talk:</h4>
              <p className="text-sm text-primary/90 font-medium">"{speaker.talkTitle}"</p>
            </div>
          )}

          {/* Talk Abstract */}
          {speaker.talkAbstract && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Abstract:</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{speaker.talkAbstract}</p>
            </div>
          )}

          {/* Expertise */}
          {speaker.expertise && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Expertise:</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{speaker.expertise}</p>
            </div>
          )}

          {/* Bio */}
          {speaker.bio && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Biography:</h4>
              <p className="text-sm text-gray-600 line-clamp-4">{speaker.bio}</p>
            </div>
          )}

          {/* Links */}
          {(speaker.websiteUrl || speaker.linkedinUrl) && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
