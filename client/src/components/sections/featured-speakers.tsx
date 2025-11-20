import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, MapPin, Building2, Globe } from "lucide-react";
import { Link } from "wouter";

interface Speaker {
  id: number;
  name: string;
  title?: string;
  institution?: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  category: string;
}

export default function FeaturedSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('/api/speakers');
        if (response.ok) {
          const data = await response.json();
          // Show only first 8 speakers for featured section
          setSpeakers(data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= speakers.length ? 0 : prevIndex + 4
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 4 < 0 ? Math.max(0, speakers.length - 4) : prevIndex - 4
    );
  };

  const visibleSpeakers = speakers.slice(currentIndex, currentIndex + 4);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (speakers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200/50 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 tracking-wider uppercase">Distinguished Speakers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">
            Featured Speakers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our distinguished speakers who will be sharing their expertise and insights
            on sustainable materials for water and energy solutions
          </p>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          {speakers.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white hover:shadow-2xl border-blue-200/50 -ml-6 transition-all duration-300"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white hover:shadow-2xl border-blue-200/50 -mr-6 transition-all duration-300"
                onClick={nextSlide}
                disabled={currentIndex + 4 >= speakers.length}
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </Button>
            </>
          )}

          {/* Speakers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500">
            {visibleSpeakers.map((speaker, index) => (
              <Card key={speaker.id} className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/30 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform-gpu">
                {/* Card gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-6 pt-8 relative z-10">
                  <div className="relative">
                    <Avatar className="w-24 h-24 mx-auto mb-6 ring-4 ring-white shadow-xl group-hover:ring-blue-200/50 transition-all duration-500 group-hover:scale-105">
                      <AvatarImage 
                        src={speaker.imageUrl} 
                        alt={speaker.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold">
                        {speaker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Decorative ring around avatar */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto mb-6 rounded-full border-2 border-blue-200/30 animate-pulse group-hover:border-blue-400/50 transition-colors duration-500"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                      {speaker.name}
                    </h3>
                    {speaker.title && (
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 border-0 px-3 py-1 font-medium transition-all duration-300"
                      >
                        {speaker.title}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 pb-8 px-6 relative z-10">
                  <div className="space-y-3">
                    {speaker.institution && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-center leading-tight">{speaker.institution}</span>
                      </div>
                    )}
                    {speaker.country && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span className="font-medium">{speaker.country}</span>
                      </div>
                    )}
                    {speaker.bio && (
                      <p className="text-sm text-gray-500 text-center line-clamp-3 leading-relaxed mt-4 group-hover:text-gray-600 transition-colors">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
                  
                  {/* Hover effect bottom border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination dots */}
          {speakers.length > 4 && (
            <div className="flex justify-center mt-12 gap-3">
              {Array.from({ length: Math.ceil(speakers.length / 4) }, (_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 4) === i 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-blue-400/50 hover:scale-110'
                  }`}
                  onClick={() => setCurrentIndex(i * 4)}
                />
              ))}
            </div>
          )}
        </div>

        {/* View all speakers button */}
        <div className="text-center mt-16">
          <Link href="/speakers">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              <Globe className="mr-3 w-5 h-5" />
              View All Speakers
              <Users className="ml-3 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
