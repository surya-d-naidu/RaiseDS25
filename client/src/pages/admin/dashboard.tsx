import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  User,
  Mail,
  Bell,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock4,
  ChevronRight
} from "lucide-react";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const { data: abstracts, isLoading: abstractsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/abstracts"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/notifications"],
  });

  const { data: invitations, isLoading: invitationsLoading } = useQuery<any[]>({
    queryKey: ["/api/invitations"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isLoading = abstractsLoading || usersLoading || notificationsLoading || invitationsLoading;

  // Calculate statistics
  const stats = {
    totalAbstracts: abstracts?.length || 0,
    pendingAbstracts: abstracts?.filter(a => a.status === 'pending')?.length || 0,
    acceptedAbstracts: abstracts?.filter(a => a.status === 'accepted')?.length || 0,
    rejectedAbstracts: abstracts?.filter(a => a.status === 'rejected')?.length || 0,
    totalUsers: users?.length || 0,
    adminUsers: users?.filter(u => u.role === 'admin')?.length || 0,
    regularUsers: users?.filter(u => u.role === 'user')?.length || 0,
    activeNotifications: notifications?.filter(n => n.isActive)?.length || 0,
    totalInvitations: invitations?.length || 0,
    pendingInvitations: invitations?.filter(i => i.status === 'pending')?.length || 0,
    acceptedInvitations: invitations?.filter(i => i.status === 'accepted')?.length || 0,
    rejectedInvitations: invitations?.filter(i => i.status === 'rejected')?.length || 0,
  };

  // Chart data
  const abstractStatusData = [
    { name: 'Pending', value: stats.pendingAbstracts },
    { name: 'Accepted', value: stats.acceptedAbstracts },
    { name: 'Rejected', value: stats.rejectedAbstracts },
  ];

  const invitationStatusData = [
    { name: 'Pending', value: stats.pendingInvitations },
    { name: 'Accepted', value: stats.acceptedInvitations },
    { name: 'Rejected', value: stats.rejectedInvitations },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444'];
  
  const today = new Date();
  const conferenceDate = new Date('2025-12-22');
  const daysRemaining = Math.ceil((conferenceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Overview of the conference statistics and management"
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Abstracts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAbstracts}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Pending: {stats.pendingAbstracts}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Accepted: {stats.acceptedAbstracts}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registered Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Regular: {stats.regularUsers}
                  </Badge>
                  <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                    Admin: {stats.adminUsers}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invitations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalInvitations}</p>
                  </div>
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Pending: {stats.pendingInvitations}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Accepted: {stats.acceptedInvitations}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                    <p className="text-3xl font-bold text-gray-900">{daysRemaining}</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Conference: Dec 22-24, 2025
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Abstract Submission Analytics</CardTitle>
                <CardDescription>
                  Overview of abstract submissions and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Ensure ResponsiveContainer has a parent with defined dimensions */}
                  <div style={{ width: '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          { name: 'Pending', value: stats.pendingAbstracts },
                          { name: 'Accepted', value: stats.acceptedAbstracts },
                          { name: 'Rejected', value: stats.rejectedAbstracts },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Pending: {stats.pendingAbstracts}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Accepted: {stats.acceptedAbstracts}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Rejected: {stats.rejectedAbstracts}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/abstracts">
                      <div className="flex items-center">
                        Manage Abstracts
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Invitation Status</CardTitle>
                <CardDescription>
                  Responses to sent invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  {stats.totalInvitations > 0 ? (
                    <div style={{ width: '100%', height: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={invitationStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {invitationStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} invitations`, 'Count']}
                            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Mail className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No invitations sent yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/invitations">
                    <div className="flex items-center justify-center">
                      Manage Invitations
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abstracts && abstracts.length > 0 ? (
                    abstracts.slice(0, 5).map((abstract) => (
                      <div key={abstract.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md">
                        {abstract.status === 'pending' ? (
                          <Clock4 className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        ) : abstract.status === 'accepted' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">Abstract: {abstract.title}</p>
                          <p className="text-xs text-gray-500">
                            <span className="capitalize">{abstract.status}</span> - {new Date(abstract.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No abstracts submitted yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/abstracts">
                    <div className="flex items-center justify-center">
                      View All Abstracts
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/invitations">
                      <Mail className="mr-2 h-5 w-5" />
                      Send New Invitation
                    </Link>
                  </Button>
                  
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/notifications">
                      <Bell className="mr-2 h-5 w-5" />
                      Create Notification
                    </Link>
                  </Button>
                  
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/abstracts">
                      <FileText className="mr-2 h-5 w-5" />
                      Review Pending Abstracts ({stats.pendingAbstracts})
                    </Link>
                  </Button>
                  
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/users">
                      <Users className="mr-2 h-5 w-5" />
                      Manage Users ({stats.totalUsers})
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-gray-50">
                <div className="w-full text-center">
                  <p className="text-sm text-gray-600">
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    <span className="font-medium">{daysRemaining} days</span> until the conference begins
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
