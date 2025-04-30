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
  
  // Hardcoded chief patrons in case there are none in the database
  const defaultChiefPatrons = [
    {
      id: -1,
      name: "Dr. G. Viswanathan",
      role: "Founder & Chancellor",
      institution: "Vellore Institute of Technology",
      country: "India",
      category: "chief_patron"
    },
    {
      id: -2,
      name: "Mr. Sankar Viswanathan",
      role: "Vice President",
      institution: "VIT University",
      country: "India",
      category: "chief_patron"
    },
    {
      id: -3,
      name: "Dr. Sekar Viswanathan",
      role: "Vice President",
      institution: "VIT University",
      country: "India",
      category: "chief_patron"
    },
    {
      id: -4,
      name: "Dr. G. V. Selvam",
      role: "Vice President",
      institution: "VIT University",
      country: "India",
      category: "chief_patron"
    }
  ];

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
            <Tabs defaultValue="organizing" className="w-full">
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
                              <Avatar className="h-24 w-24 bg-red-50 text-red-700 mb-4">
                                <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <h3 className="text-xl font-bold text-gray-900 text-center">{member.name}</h3>
                              <p className="text-md text-gray-600 text-center mt-1">{member.role}</p>
                              {member.institution && (
                                <p className="text-sm text-gray-500 text-center mt-2">{member.institution}</p>
                              )}
                            </div>
                          </div>
                        )) : 
                        defaultChiefPatrons.map((patron) => (
                          <div key={patron.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-24 w-24 bg-red-50 text-red-700 mb-4">
                                <AvatarFallback className="text-xl">{getInitials(patron.name)}</AvatarFallback>
                              </Avatar>
                              <h3 className="text-xl font-bold text-gray-900 text-center">{patron.name}</h3>
                              <p className="text-md text-gray-600 text-center mt-1">{patron.role}</p>
                              {patron.institution && (
                                <p className="text-sm text-gray-500 text-center mt-2">{patron.institution}</p>
                              )}
                            </div>
                          </div>
                        ))
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
                          <div key={member.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 bg-primary-100 text-primary-800">
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            {(member.institution || member.country) && (
                              <>
                                <Separator className="my-3" />
                                <div className="text-sm text-gray-600">
                                  {member.institution && <p>{member.institution}</p>}
                                  {member.country && <p>{member.country}</p>}
                                </div>
                              </>
                            )}
                            {(member.email || member.phone) && (
                              <div className="mt-3 text-sm text-gray-600">
                                {member.email && (
                                  <a href={`mailto:${member.email}`} className="block text-primary hover:underline">
                                    {member.email}
                                  </a>
                                )}
                                {member.phone && <p>{member.phone}</p>}
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
                    
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Conference Secretaries</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Mahipal Reddy</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Francis P</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Varunkumar M</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. V. Raja</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. K. Durga Prasad</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Ramesh. A</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Prakash S</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Yada Nandakumar</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">Dr. Gokulnath M</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              

              
              <TabsContent value="advisory" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Advisory Committee</h2>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="max-h-96 overflow-y-auto p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {membersByCategory.advisory_committee.length > 0 ? (
                            membersByCategory.advisory_committee.map((member) => (
                              <div key={member.id} className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">{member.country || "—"}</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-500">{member.institution || "—"}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-8 text-gray-500">
                              <p>No advisory committee members to display</p>
                            </div>
                          )}
                          
                          {/* Hardcoded advisory committee members as fallback */}
                          {membersByCategory.advisory_committee.length === 0 && (
                            <>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">USA</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. S R Jammalamadaka</p>
                                  <p className="text-sm text-gray-500">University of California</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">USA</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. M.B Rao</p>
                                  <p className="text-sm text-gray-500">University of Cincinnati</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">USA</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. J.N.K. Rao</p>
                                  <p className="text-sm text-gray-500">Carleton University</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">USA</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. N. Balakrishnan</p>
                                  <p className="text-sm text-gray-500">McMaster University</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">India</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. B.L.S. Prakash Rao</p>
                                  <p className="text-sm text-gray-500">ISI-K</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5">USA</Badge>
                                <div>
                                  <p className="font-medium text-gray-900">Prof. Ravindra Khatree</p>
                                  <p className="text-sm text-gray-500">Georgia State University</p>
                                </div>
                              </div>
                            </>
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
                          <div key={member.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                            {member.institution && (
                              <p className="mt-2 text-sm text-gray-600">{member.institution}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                          <p>No ISPS executive committee members to display</p>
                        </div>
                      )}
                      
                      {/* Hardcoded ISPS executive committee members as fallback */}
                      {membersByCategory.isps_executive.length === 0 && (
                        <>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Prof. P RajaSekhara Reddy</h3>
                            <p className="text-sm text-gray-500">Hon. President</p>
                            <p className="mt-2 text-sm text-gray-600">SVU</p>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Prof. P G Sankaran</h3>
                            <p className="text-sm text-gray-500">President</p>
                            <p className="mt-2 text-sm text-gray-600">CUSAT</p>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Prof. R L Shinde</h3>
                            <p className="text-sm text-gray-500">Secretary</p>
                            <p className="mt-2 text-sm text-gray-600">NMU</p>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Dr. Neha Garg</h3>
                            <p className="text-sm text-gray-500">Joint Secretary</p>
                            <p className="mt-2 text-sm text-gray-600">IGNOU</p>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Prof. Somesh Kumar</h3>
                            <p className="text-sm text-gray-500">Vice-President</p>
                            <p className="mt-2 text-sm text-gray-600">IIT-Kh</p>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Prof. Sharada V Bhat</h3>
                            <p className="text-sm text-gray-500">Vice-President</p>
                            <p className="mt-2 text-sm text-gray-600">KU</p>
                          </div>
                        </>
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
