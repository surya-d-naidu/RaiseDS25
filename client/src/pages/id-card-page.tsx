import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ConferenceIdCard from "@/components/conference-id-card";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IdCardPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Conference ID Card - RAISE DS 2025</title>
        <meta name="description" content="Your official RAISE DS 2025 conference identification card" />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Conference ID Card
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your official identification card for RAISE DS 2025 - 45th Annual Convention of ISPS. 
              Download and print for easy access during the conference.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Digital ID Card</CardTitle>
              <CardDescription>
                Generated based on your profile and registration information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <ConferenceIdCard />
            </CardContent>
          </Card>

          <div className="mt-8 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
                    Click "Download ID Card" to save your card as a PNG image
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
                    Print the downloaded image for physical identification during the conference
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
                    Keep both digital and physical copies for easy access
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">4</span>
                    Present your ID card for venue access and session attendance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
