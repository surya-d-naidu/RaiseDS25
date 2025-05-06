import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Calendar, MapPin, User } from "lucide-react";

export default function AttendanceResponse() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const { data: invitation, isLoading, isError } = useQuery({
    queryKey: ["/api/invitations/verify", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await apiRequest("GET", `/api/invitations/verify?token=${token}`);
        return await res.json();
      } catch (error) {
        console.error("Error fetching invitation:", error);
        return null;
      }
    },
    enabled: !!token,
  });

  const responseMutation = useMutation({
    mutationFn: async ({ accept }: { accept: boolean }) => {
      if (!token) throw new Error("No token provided");
      const res = await apiRequest("POST", "/api/invitations/attendance-response", {
        token,
        accept,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setResponded(true);
      toast({
        title: data.accept ? "Attendance Confirmed" : "Response Recorded",
        description: data.accept 
          ? "Thank you for confirming your attendance. We look forward to seeing you at the event."
          : "Thank you for letting us know. We hope to see you at future events.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing your response.",
        variant: "destructive",
      });
    },
  });

  const handleResponse = (accept: boolean) => {
    responseMutation.mutate({ accept });
  };

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card>
          <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !invitation) {
    return (
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setLocation("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Response Already Recorded</CardTitle>
            <CardDescription className="text-center">
              You have already responded to this invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your response: <span className="font-semibold">{invitation.status === "accepted" ? "Attending" : "Not Attending"}</span>
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setLocation("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Conference Invitation</CardTitle>
          <CardDescription className="text-center">
            You are invited to attend the RAISEDS 2025 Conference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Dear {invitation.name},</h3>
              <p className="text-gray-700 mb-4">
                We are pleased to invite you to the RAISEDS 2025 Conference. Your presence would be greatly appreciated.
              </p>
              {invitation.message && (
                <div className="border-l-4 border-blue-300 pl-3 italic text-gray-600 my-4">
                  {invitation.message}
                </div>
              )}
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <span>December 22-24, 2025</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                <span>VIT-AP University, Amaravati, India</span>
              </div>
              {invitation.position && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-3" />
                  <span>{invitation.position}, {invitation.institution}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          {responded ? (
            <div className="text-center w-full py-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <p className="text-lg font-medium">Thank you for your response!</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setLocation("/")}
              >
                Return to Home
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleResponse(true)}
                disabled={responseMutation.isPending}
              >
                {responseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Yes, I'll Attend
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => handleResponse(false)}
                disabled={responseMutation.isPending}
              >
                {responseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Sorry, Can't Attend
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}