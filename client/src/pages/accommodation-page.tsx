import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet";
import { Building2, Calendar, MapPin, Star, Clock, Mail, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const accommodationFormSchema = z.object({
  arrivalDate: z.string().min(1, "Arrival date is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  arrivalPlace: z.string().min(1, "Place of arrival is required"),
  accommodationType: z.string().optional(),
  age: z.string().min(1, "Age is required").transform((val) => parseInt(val, 10)),
  gender: z.string().min(1, "Gender selection is required"),
  specialRequests: z.string().optional(),
});

export default function AccommodationPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    arrivalDate: '',
    departureDate: '',
    arrivalPlace: '',
    accommodationType: '',
    age: '',
    gender: '',
    specialRequests: '',
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: existingRequest } = useQuery({
    queryKey: ["/api/accommodation-request"],
    enabled: !!user,
  });

  const accommodationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/accommodation-request", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your accommodation request has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/accommodation-request"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = accommodationFormSchema.parse(formData);
      accommodationMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Accommodation | RAISE DS 2025</title>
        <meta name="description" content="Hotel and accommodation information for RAISE DS 2025 conference attendees." />
      </Helmet>
      
      <Navbar />
      
      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Accommodation Request
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Submit your accommodation requirements for RAISE DS 2025
            </p>
          </div>

          {user ? (
            existingRequest ? (
              /* Show existing request */
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Accommodation Request Submitted</CardTitle>
                    <CardDescription>
                      Your accommodation request has been received and is being processed.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Arrival Date</Label>
                        <p className="text-gray-900">{new Date(existingRequest.arrivalDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Departure Date</Label>
                        <p className="text-gray-900">{new Date(existingRequest.departureDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Arrival Place</Label>
                        <p className="text-gray-900">{existingRequest.arrivalPlace}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <p className={`font-medium ${existingRequest.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
                          {existingRequest.status.charAt(0).toUpperCase() + existingRequest.status.slice(1)}
                        </p>
                      </div>
                      {existingRequest.accommodationType && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Accommodation Type</Label>
                          <p className="text-gray-900">{existingRequest.accommodationType}</p>
                        </div>
                      )}
                      {existingRequest.age && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Age</Label>
                          <p className="text-gray-900">{existingRequest.age}</p>
                        </div>
                      )}
                      {existingRequest.gender && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Gender</Label>
                          <p className="text-gray-900">{existingRequest.gender.charAt(0).toUpperCase() + existingRequest.gender.slice(1)}</p>
                        </div>
                      )}
                    </div>
                    {existingRequest.specialRequests && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-600">Special Requests</Label>
                        <p className="text-gray-900">{existingRequest.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Show accommodation form */
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Accommodation Request Form</CardTitle>
                    <CardDescription>
                      Please provide your accommodation requirements for the conference period (December 22-24, 2025)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="arrivalDate">Date of Arrival *</Label>
                          <Input
                            id="arrivalDate"
                            type="date"
                            value={formData.arrivalDate}
                            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="departureDate">Date of Departure *</Label>
                          <Input
                            id="departureDate"
                            type="date"
                            value={formData.departureDate}
                            onChange={(e) => handleInputChange('departureDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="arrivalPlace">Place of Arrival *</Label>
                        <Input
                          id="arrivalPlace"
                          placeholder="e.g., Vijayawada Airport, Guntur Railway Station, Amaravati Bus Stand"
                          value={formData.arrivalPlace}
                          onChange={(e) => handleInputChange('arrivalPlace', e.target.value)}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Please specify your arrival point (airport, railway station, bus stand, etc.)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="accommodationType">Accommodation Type Preference</Label>
                        <Select onValueChange={(value) => handleInputChange('accommodationType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accommodation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Room</SelectItem>
                            <SelectItem value="double">Double Room</SelectItem>
                            <SelectItem value="shared">Shared Room</SelectItem>
                            <SelectItem value="any">Any Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age *</Label>
                          <Input
                            id="age"
                            type="number"
                            min="1"
                            max="120"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender *</Label>
                          <Select onValueChange={(value) => handleInputChange('gender', value)} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Privacy Note:</strong> Age and gender information will be used solely for accommodation allocation 
                          purposes to ensure appropriate room assignments and comply with university accommodation policies. 
                          This data will be kept confidential and used only by the organizing committee.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                        <Textarea
                          id="specialRequests"
                          placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                          value={formData.specialRequests}
                          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={accommodationMutation.isPending}
                      >
                        {accommodationMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Request...
                          </>
                        ) : (
                          'Submit Accommodation Request'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )
          ) : (
            /* Show login prompt */
            <div className="max-w-3xl mx-auto">
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Login Required
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Please log in to submit your accommodation request for RAISE DS 2025.
                  </p>
                  <Button asChild>
                    <a href="/auth">Login to Continue</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All recommended accommodations will be strategically located for easy access 
                  to the conference venue at VIT-AP University.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="mr-2 h-5 w-5 text-primary" />
                  Quality Assured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We are partnering with verified hotels and guest houses that meet 
                  our quality standards for cleanliness, safety, and service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Conference Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Special conference rates will be available for attendees who book 
                  accommodations through our recommended partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
