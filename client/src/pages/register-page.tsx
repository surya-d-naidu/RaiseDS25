import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotificationBar from "@/components/layout/notification-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Building2, 
  Users, 
  Backpack
} from "lucide-react";

export default function RegisterPage() {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Register | RAISE DS 2025</title>
        <meta name="description" content="Register for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)." />
      </Helmet>
      
      <NotificationBar />
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Register for RAISE DS 2025
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Join us for the 45th Annual Convention of ISPS in conjunction with IC-RAISE DS
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Registration Options</CardTitle>
                  <CardDescription>
                    Choose the registration category that best fits your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="standard">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                      <TabsTrigger value="student">Student</TabsTrigger>
                      <TabsTrigger value="international">International</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="standard" className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Early Bird (Until Nov 20)</TableHead>
                            <TableHead>Regular</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Faculty/Scientists (ISPS Member)</TableCell>
                            <TableCell>₹4,000</TableCell>
                            <TableCell>₹5,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Faculty/Scientists (Non-Member)</TableCell>
                            <TableCell>₹5,000</TableCell>
                            <TableCell>₹6,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Industry Personnel (ISPS Member)</TableCell>
                            <TableCell>₹5,000</TableCell>
                            <TableCell>₹6,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Industry Personnel (Non-Member)</TableCell>
                            <TableCell>₹6,000</TableCell>
                            <TableCell>₹7,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Accompanying Person</TableCell>
                            <TableCell>₹3,000</TableCell>
                            <TableCell>₹4,000</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="student" className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Early Bird (Until Nov 20)</TableHead>
                            <TableHead>Regular</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Research Scholars/Students (ISPS Member)</TableCell>
                            <TableCell>₹2,400</TableCell>
                            <TableCell>₹3,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Research Scholars/Students (Non-Member)</TableCell>
                            <TableCell>₹3,000</TableCell>
                            <TableCell>₹3,500</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <p className="mt-4 text-sm text-gray-500">
                        <span className="font-medium text-amber-600">Note:</span> Students must provide valid student ID proof during registration.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="international" className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Early Bird (Until Nov 20)</TableHead>
                            <TableHead>Regular</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Foreign Delegates (ISPS Member)</TableCell>
                            <TableCell>US$ 240</TableCell>
                            <TableCell>US$ 280</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Foreign Delegates (Non-Member)</TableCell>
                            <TableCell>US$ 300</TableCell>
                            <TableCell>US$ 350</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Accompanying Person</TableCell>
                            <TableCell>US$ 80</TableCell>
                            <TableCell>US$ 100</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                    Registration Includes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Conference Kit</h3>
                        <p className="mt-1 text-sm text-gray-500">Conference materials, name badge, and certificate</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Access to Sessions</h3>
                        <p className="mt-1 text-sm text-gray-500">All keynotes, technical sessions, and panels</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Refreshments</h3>
                        <p className="mt-1 text-sm text-gray-500">Coffee breaks and lunches on all conference days</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Welcome Reception</h3>
                        <p className="mt-1 text-sm text-gray-500">Networking event on the first day of the conference</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Conference Dinner</h3>
                        <p className="mt-1 text-sm text-gray-500">Gala dinner with cultural program</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Digital Proceedings</h3>
                        <p className="mt-1 text-sm text-gray-500">Access to electronic conference proceedings</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-primary" />
                    Workshop Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-indigo max-w-none">
                    <p>
                      Registration for the pre-conference workshop on "Data Science & Machine Learning" is available for all participants, with special rates for ISPS Life Members. The workshop will be held on December 21, 2025.
                    </p>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Calendar className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-amber-700">
                            Workshop registration fees: Faculty/Scientists (ISPS Members) - ₹1,000 (early bird) / ₹1,500 (regular); 
                            Industry Personnel (ISPS Members) - ₹1,000 (early bird) / ₹2,000 (regular);
                            Research Scholars/Students - ₹700 (early bird) / ₹1,000 (regular);
                            Foreign Delegates - US$80 (early bird) / US$100 (regular).
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p>
                      The workshop will cover advanced topics in data science and machine learning with a focus on their applications in statistical research. Participants will receive a separate certificate of participation for the workshop.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-8 bg-gradient-to-br from-primary-50 to-white sticky top-8">
                <CardHeader>
                  <Badge className="w-fit" variant="outline">Limited Time Offer</Badge>
                  <CardTitle>Early Bird Registration</CardTitle>
                  <CardDescription>Register before November 20, 2025 to avail discounted rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Registration Deadline</p>
                      <p className="text-gray-600">December 10, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Conference Dates</p>
                      <p className="text-gray-600">December 22-24, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Backpack className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Workshop Date</p>
                      <p className="text-gray-600">December 21, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Venue</p>
                      <p className="text-gray-600">VIT-AP University, Amaravati</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-gray-900">₹2,400</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Link href={user ? "#registration-form" : "/auth"}>
                    <Button className="w-full">
                      {user ? "Register Now" : "Sign In to Register"}
                    </Button>
                  </Link>
                  <a href="/api/brochure" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Brochure
                    </Button>
                  </a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h3 className="font-medium text-gray-900">Bank Transfer</h3>
                      <p className="mt-1">
                        Account Name: RAISE DS 2025<br />
                        Account Number: XXXX XXXX XXXX 1234<br />
                        IFSC Code: ABCD0001234<br />
                        Bank: State Bank of India<br />
                        Branch: VIT-AP Campus
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Online Payment</h3>
                      <p className="mt-1">
                        Secure online payment options will be available during the registration process, including credit card, debit card, and UPI.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <p className="font-medium text-gray-900">Registration Cancellation Policy</p>
                      <p className="mt-1">
                        • Before November 15, 2025: 75% refund<br />
                        • Before December 1, 2025: 50% refund<br />
                        • After December 1, 2025: No refund
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-16" id="registration-form">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {user ? "Complete Your Registration" : "Create an Account to Register"}
            </h2>
            
            {user ? (
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Registration Form</CardTitle>
                  <CardDescription>
                    Please complete all the required fields to register for the conference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-center py-6 text-gray-600">
                      Registration form will be available soon. Please check back later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  You need to create an account or sign in to register for the conference.
                </p>
                <Link href="/auth">
                  <Button size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    Sign In or Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is on-site registration available?</h3>
                <p className="text-gray-600">
                  Yes, on-site registration will be available at the conference venue. However, on-site registrants will be charged a higher fee and cannot be guaranteed conference materials or participation in social events due to limited availability.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can I attend specific days of the conference?</h3>
                <p className="text-gray-600">
                  Yes, single-day registration options will be available. Please contact the organizing committee at raiseds25@vitap.ac.in for details on single-day registration fees and arrangements.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How can I become an ISPS member to avail discounted rates?</h3>
                <p className="text-gray-600">
                  To become an ISPS member, please visit the ISPS website and complete the membership application process. Once approved, you will receive a membership ID that you can use during the registration process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is accommodation included in the registration fee?</h3>
                <p className="text-gray-600">
                  No, the registration fee does not include accommodation. However, we have arranged special rates with several local hotels. Details will be provided after registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
