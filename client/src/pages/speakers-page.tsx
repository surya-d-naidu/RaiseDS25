import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Linkedin, Twitter, Mail } from "lucide-react";

interface Speaker {
  id: number;
  name: string;
  title?: string;
  institution?: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  category: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('/api/speakers');
        if (response.ok) {
          const data = await response.json();
          setSpeakers(data);
        }
      } catch (error) {
        console.error('Error fetching speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const speakersByCategory = speakers.reduce((acc, speaker) => {
    if (!acc[speaker.category]) {
      acc[speaker.category] = [];
    }
    acc[speaker.category].push(speaker);
    return acc;
  }, {} as Record<string, Speaker[]>);

  const categories = Object.keys(speakersByCategory);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading speakers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Conference Speakers</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet our distinguished speakers who will be sharing their expertise and insights
          at SuWatE+'26.
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className={`grid w-full grid-cols-${Math.min(categories.length, 4)} mb-8`}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category.replace('_', ' ')} Speakers
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakersByCategory[category].map((speaker) => (
                <Card key={speaker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={speaker.imageUrl} alt={speaker.name} />
                      <AvatarFallback className="text-lg">
                        {speaker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{speaker.name}</CardTitle>
                    {speaker.title && (
                      <Badge variant="secondary" className="mt-2">
                        {speaker.title}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {speaker.institution && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Institution:</strong> {speaker.institution}
                      </p>
                    )}
                    {speaker.country && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Country:</strong> {speaker.country}
                      </p>
                    )}
                    {speaker.bio && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {speaker.bio}
                      </p>
                    )}
                    {speaker.socialLinks && (
                      <div className="flex gap-2 justify-center">
                        {speaker.socialLinks.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={speaker.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {speaker.socialLinks.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${speaker.socialLinks.email}`}>
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}