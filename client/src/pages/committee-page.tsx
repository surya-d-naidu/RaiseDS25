import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CommitteeMember } from "@shared/schema";
import { Loader2, Users, Award } from "lucide-react";

export default function CommitteePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: allMembers, isLoading } = useQuery<CommitteeMember[]>({
    queryKey: ["/api/committee"],
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const membersByCategory = {
    chief_patron: allMembers?.filter(m => m.category === "chief_patron") || [],
    patron: allMembers?.filter(m => m.category === "patron") || [],
    organizing_committee: allMembers?.filter(m => m.category === "organizing_committee") || [],
    advisory_committee: allMembers?.filter(m => m.category === "advisory_committee") || [],
    isps_executive: allMembers?.filter(m => m.category === "isps_executive") || [],
  };

  return (
    <>
      <Helmet>
        <title>Committee | RAISE DS 2025</title>
        <meta name="description" content="Meet the organizing committee of the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Conference Committee
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Meet the team behind RAISE DS 2025
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="chief_patrons" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chief_patrons">Chief Patrons</TabsTrigger>
                <TabsTrigger value="organizing">Organizing</TabsTrigger>
                <TabsTrigger value="advisory">Advisory</TabsTrigger>
                <TabsTrigger value="isps">ISPS Executive</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chief_patrons" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Award className="mr-2 h-6 w-6 text-red-700" />
                      Chief Patrons
                    </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {membersByCategory.chief_patron.length > 0 ? 
                        membersByCategory.chief_patron.map((member) => (
                          <div key={member.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg">
                            <div className="flex flex-col items-center">
                              <div className="relative mb-4">
                                {member.image ? (
                                  <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-red-200 shadow-md">
                                    <img 
                                      src={member.image} 
                                      alt={member.name} 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        // Fallback to initials if image loading fails
                                        e.currentTarget.style.display = 'none';
                                        const avatarEl = document.getElementById(`avatar-${member.id}`);
                                        if (avatarEl) {
                                          avatarEl.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <Avatar className="h-32 w-32 bg-gradient-to-br from-red-50 to-red-100 text-red-700" id={`avatar-${member.id}`}>
                                    <AvatarFallback className="text-2xl font-semibold">{getInitials(member.name)}</AvatarFallback>
                                  </Avatar>
                                )}
                                {member.profileLink && (
                                  <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md hover:bg-primary-600 transition-colors">
                                    <a href={member.profileLink} target="_blank" rel="noopener noreferrer" aria-label="View profile" className="block">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                      </svg>
                                    </a>
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="text-xl font-bold text-gray-900 text-center">{member.name}</h3>
                              <p className="text-md text-gray-600 text-center mt-1 font-medium">{member.role}</p>
                              
                              <div className="mt-4 w-full pt-3 border-t border-gray-100">
                                {member.institution && (
                                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <p className="text-sm text-gray-600 text-center">{member.institution}</p>
                                  </div>
                                )}
                                {member.country && (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                                    </svg>
                                    <p className="text-sm text-gray-600 text-center">{member.country}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )) : 
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          <p>No chief patrons to display</p>
                        </div>
                      }
                    </div>

                    <div className="mt-12">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-lg mb-2">Conference</h4>
                          <p className="text-gray-700">raiseds25@vitap.ac.in</p>
                          <p className="text-gray-700">www.raiseds25.com</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-lg mb-2">Convener</h4>
                          <p className="text-gray-700">Dr. Vasili B V Nagarjuna</p>
                          <p className="text-gray-700">nagarjuna.vasili@vitap.ac.in</p>
                          <p className="text-gray-700">+91-7673944853</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="organizing" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Users className="mr-2 h-6 w-6 text-primary" />
                      Organizing Committee
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {membersByCategory.organizing_committee.length > 0 ? (
                        membersByCategory.organizing_committee.map((member) => (
                          <div key={member.id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all group hover:border-primary-100">
                            <div className="flex items-center">
                              <div className="relative">
                                {member.image ? (
                                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary-50 shadow-sm">
                                    <img 
                                      src={member.image} 
                                      alt={member.name} 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const avatarEl = document.getElementById(`org-avatar-${member.id}`);
                                        if (avatarEl) {
                                          avatarEl.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <Avatar className="h-16 w-16 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700" id={`org-avatar-${member.id}`}>
                                    <AvatarFallback className="text-lg font-medium">{getInitials(member.name)}</AvatarFallback>
                                  </Avatar>
                                )}
                                {member.profileLink && (
                                  <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-sm hover:bg-primary-600 transition-colors opacity-90 group-hover:opacity-100">
                                    <a href={member.profileLink} target="_blank" rel="noopener noreferrer" aria-label="View profile">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                      </svg>
                                    </a>
                                  </span>
                                )}
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            
                            {(member.institution || member.country) && (
                              <>
                                <Separator className="my-3" />
                                <div className="grid grid-cols-1 gap-2">
                                  {member.institution && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                      </svg>
                                      <span className="text-gray-600">{member.institution}</span>
                                    </div>
                                  )}
                                  {member.country && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                                      </svg>
                                      <span className="text-gray-600">{member.country}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {(member.email || member.phone) && (
                              <div className="mt-3 text-sm border-t border-gray-100 pt-3">
                                {member.email && (
                                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-primary hover:underline">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                      <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    {member.email}
                                  </a>
                                )}
                                {member.phone && (
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                                    </svg>
                                    {member.phone}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                          <p>No committee members to display</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advisory" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Advisory Committee</h2>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {membersByCategory.advisory_committee.length > 0 ? (
                            membersByCategory.advisory_committee.map((member) => (
                              <div key={member.id} className="flex flex-col bg-white p-3 rounded-md hover:bg-gray-50 border border-gray-100 transition-all hover:shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  {member.image ? (
                                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                      <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="h-full w-full object-cover"                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const avatarEl = document.getElementById(`adv-avatar-${member.id}`);
                                            if (avatarEl) {
                                              avatarEl.style.display = 'flex';
                                            }
                                          }}
                                      />
                                    </div>
                                  ) : (
                                    <Avatar 
                                      id={`adv-avatar-${member.id}`}
                                      className="h-12 w-12 bg-blue-50 text-blue-700"
                                    >
                                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <div>
                                    {member.profileLink ? (
                                      <a href={member.profileLink} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-primary hover:underline block">
                                        {member.name}
                                      </a>
                                    ) : (
                                      <p className="font-medium text-gray-900">{member.name}</p>
                                    )}
                                    <p className="text-xs text-gray-500">{member.role || "Advisory Member"}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-1 text-sm flex flex-col gap-1">
                                  {member.institution && (
                                    <div className="flex items-center gap-1.5">
                                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                      </svg>
                                      <span className="text-gray-600 text-xs">{member.institution}</span>
                                    </div>
                                  )}
                                  {member.country && (
                                    <div className="flex items-center">
                                      <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5">
                                        {member.country}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-4 text-center py-8 text-gray-500">
                              <p>No advisory committee members to display</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="isps" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">ISPS Executive Committee</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {membersByCategory.isps_executive.length > 0 ? (
                        membersByCategory.isps_executive.map((member) => (
                          <div key={member.id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all hover:border-blue-100">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                  {member.image ? (
                                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-blue-50 shadow-sm">
                                      <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="h-full w-full object-cover"                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const avatarEl = document.getElementById(`isps-avatar-${member.id}`);
                                            if (avatarEl) {
                                              avatarEl.style.display = 'flex';
                                            }
                                          }}
                                      />
                                    </div>
                                  ) : (
                                    <Avatar className="h-16 w-16 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700" id={`isps-avatar-${member.id}`}>
                                      <AvatarFallback className="text-lg font-medium">{getInitials(member.name)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  {member.profileLink && (
                                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-sm hover:bg-blue-600 transition-colors opacity-90 hover:opacity-100">
                                      <a href={member.profileLink} target="_blank" rel="noopener noreferrer" aria-label="View profile">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                          <polyline points="15 3 21 3 21 9"></polyline>
                                          <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                      </a>
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                                  <div className="flex items-center mt-1">
                                    <Badge variant="secondary" className="font-normal text-xs">{member.role}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-100 pt-3 mt-2 grid gap-2">
                                {member.institution && (
                                  <div className="flex items-center gap-2.5">
                                    <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <p className="text-sm text-gray-700">{member.institution}</p>
                                  </div>
                                )}
                                {member.country && (
                                  <div className="flex items-center gap-2.5">
                                    <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                                    </svg>
                                    <p className="text-sm text-gray-700">{member.country}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                          <p>No ISPS executive committee members to display</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get in Touch with the Organizing Committee
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              For any inquiries related to the conference, please feel free to contact any of the organizing committee members listed above or reach out to us at:
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700">
              <a href="mailto:raiseds25@vitap.ac.in">raiseds25@vitap.ac.in</a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
