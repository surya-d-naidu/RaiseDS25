import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Filter
} from "lucide-react";

interface AccommodationRequest {
  id: number;
  userId: number;
  arrivalDate: string;
  departureDate: string;
  arrivalPlace: string;
  accommodationType?: string;
  age?: number;
  gender?: string;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminAccommodations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  const { data: requests, isLoading } = useQuery<AccommodationRequest[]>({
    queryKey: ["/api/admin/accommodation-requests"],
  });

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/accommodation-requests/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Accommodation request status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/accommodation-requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create a map of userId to user data
  const userMap = users?.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, any>) || {};

  // Filter requests
  const filteredRequests = requests?.filter(request => {
    const user = userMap[request.userId];
    const userName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : '';
    const userEmail = user?.email.toLowerCase() || '';
    
    const matchesSearch = searchTerm === "" || 
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase()) ||
      request.arrivalPlace.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesGender = genderFilter === "all" || request.gender === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  }) || [];

  const stats = {
    total: requests?.length || 0,
    pending: requests?.filter(r => r.status === 'pending').length || 0,
    confirmed: requests?.filter(r => r.status === 'confirmed').length || 0,
    cancelled: requests?.filter(r => r.status === 'cancelled').length || 0,
    male: requests?.filter(r => r.gender === 'male').length || 0,
    female: requests?.filter(r => r.gender === 'female').length || 0,
  };

  const exportData = () => {
    if (!requests || requests.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no accommodation requests to export.",
        variant: "destructive",
      });
      return;
    }

    const csvData = [
      ['ID', 'Name', 'Email', 'Arrival Date', 'Departure Date', 'Arrival Place', 'Accommodation Type', 'Age', 'Gender', 'Status', 'Special Requests', 'Submitted At'],
      ...requests.map(request => {
        const user = userMap[request.userId];
        return [
          request.id.toString(),
          user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          user?.email || 'Unknown',
          new Date(request.arrivalDate).toLocaleDateString(),
          new Date(request.departureDate).toLocaleDateString(),
          request.arrivalPlace,
          request.accommodationType || 'Not specified',
          request.age?.toString() || 'Not specified',
          request.gender || 'Not specified',
          request.status,
          request.specialRequests || 'None',
          new Date(request.createdAt).toLocaleDateString()
        ];
      })
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accommodation-requests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout 
      title="Accommodation Management" 
      description="Manage accommodation requests and allocations"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters & Export</span>
            <Button onClick={exportData} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {filteredRequests.length} of {stats.total} requests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Requests</CardTitle>
          <CardDescription>
            Manage and track all accommodation requests from conference attendees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading accommodation requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" || genderFilter !== "all" 
                  ? "No requests match your current filters" 
                  : "No accommodation requests have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Arrival Details</TableHead>
                    <TableHead>Stay Period</TableHead>
                    <TableHead>Demographics</TableHead>
                    <TableHead>Preferences</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const user = userMap[request.userId];
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500">ID: {request.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{user?.email || 'Unknown'}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm">{request.arrivalPlace}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {new Date(request.arrivalDate).toLocaleDateString()} -
                            </p>
                            <p className="text-sm">
                              {new Date(request.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">Age: {request.age || 'N/A'}</p>
                            <p className="text-sm">Gender: {request.gender || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{request.accommodationType || 'Any'}</p>
                            {request.specialRequests && (
                              <p className="text-xs text-gray-500 truncate max-w-32" title={request.specialRequests}>
                                {request.specialRequests}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'confirmed' ? 'default' :
                            request.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(status) => updateStatusMutation.mutate({ id: request.id, status })}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
