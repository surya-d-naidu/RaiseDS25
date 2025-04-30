import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, User, Mail, Calendar, Clock, Building, Award, Loader2 } from "lucide-react";
import ProfileForm from "@/components/forms/profile-form";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });
  
  const { data: abstracts } = useQuery<any[]>({
    queryKey: ["/api/abstracts"],
    enabled: !!user,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>My Profile | RAISE DS 2025</title>
        <meta name="description" content="Manage your profile for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Manage your account and submissions
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4 bg-primary text-primary-foreground">
                        <AvatarFallback>{user ? getInitials(user.firstName + " " + user.lastName) : "U"}</AvatarFallback>
                      </Avatar>
                      {user && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                          <p className="text-gray-500 mt-1">{user.username}</p>
                          <p className="text-gray-500 flex items-center justify-center mt-2">
                            <Mail className="h-4 w-4 mr-1" /> {user.email}
                          </p>
                          <p className="text-gray-500 flex items-center justify-center mt-2">
                            <Building className="h-4 w-4 mr-1" /> {user.institution}
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 w-full mt-6">
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                          <span className="block text-2xl font-semibold text-gray-900">{abstracts?.length || 0}</span>
                          <span className="text-sm text-gray-500">Abstracts</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                          <span className="block text-2xl font-semibold text-gray-900">
                            {abstracts?.filter(a => a.status === 'accepted')?.length || 0}
                          </span>
                          <span className="text-sm text-gray-500">Accepted</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 w-full">
                        <Badge variant={user?.role === 'admin' ? "secondary" : "outline"} className="w-full">
                          {user?.role === 'admin' ? 'Administrator' : 'Participant'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Member Since</span>
                        <span className="text-gray-900 font-medium">
                          {user?.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Type</span>
                        <span className="text-gray-900 font-medium capitalize">{user?.role || 'User'}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="pt-2">
                        <p className="text-gray-500 text-xs mb-2">Need help with your account?</p>
                        <a href="mailto:raiseds25@vitap.ac.in" className="text-primary text-xs hover:underline">
                          Contact support
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="abstracts">My Abstracts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your professional details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ProfileForm profile={profile} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="abstracts" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Abstracts</CardTitle>
                        <CardDescription>
                          Review your submitted abstracts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!abstracts || abstracts.length === 0 ? (
                          <div className="text-center py-12 border rounded-lg">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No abstracts submitted yet</h3>
                            <p className="text-gray-500 mb-4">You haven't submitted any abstracts for the conference</p>
                            <Button variant="default" asChild>
                              <a href="/abstracts/submit">Submit an Abstract</a>
                            </Button>
                          </div>
                        ) : (
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
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Category:</span>
                                      <span className="ml-2 text-sm text-gray-900">{abstract.category}</span>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Submitted:</span>
                                      <span className="ml-2 text-sm text-gray-900">
                                        {new Date(abstract.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500">Keywords:</span>
                                    <span className="ml-2 text-sm text-gray-900">{abstract.keywords}</span>
                                  </div>
                                  
                                  <div className="prose prose-sm max-w-none">
                                    <h4 className="text-sm font-medium text-gray-500">Abstract Preview:</h4>
                                    <p className="text-sm text-gray-900 mt-1">
                                      {abstract.content.length > 150 
                                        ? abstract.content.substring(0, 150) + '...' 
                                        : abstract.content
                                      }
                                    </p>
                                  </div>
                                  
                                  <div className="mt-4 flex space-x-2">
                                    {abstract.fileUrl && (
                                      <a
                                        href={abstract.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                                      >
                                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                                        View File
                                      </a>
                                    )}
                                    <Button variant="outline" size="sm" asChild>
                                      <a href="/abstracts/submit">Details</a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
