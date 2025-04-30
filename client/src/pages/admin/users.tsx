import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, UserCog, ShieldCheck, UserX, User, Mail, Calendar, Building } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}/role`, { role });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: "The user role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users
    ? users
        .filter((user) => {
          if (roleFilter !== "all" && user.role !== roleFilter) {
            return false;
          }
          if (searchQuery === "") return true;
          
          return (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.institution.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  const viewUser = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout
      title="Manage Users"
      description="View and manage user accounts"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>
              {users?.length} registered users
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 text-xs">
                            <AvatarFallback>
                              {getInitials(`${user.firstName} ${user.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{user.institution}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "secondary" : "outline"}
                          className={`${
                            user.role === "admin"
                              ? ""
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck className="mr-1 h-3 w-3" />
                          ) : (
                            <User className="mr-1 h-3 w-3" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewUser(user)}
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500">
                {searchQuery || roleFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No users have registered yet"}
              </p>
            </div>
          )}

          {/* User Management Dialog */}
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Manage User</DialogTitle>
                <DialogDescription>
                  View and update user information
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Avatar className="h-24 w-24 text-lg">
                        <AvatarFallback>
                          {getInitials(`${selectedUser.firstName} ${selectedUser.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="grid gap-4 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                            <p className="text-base font-medium">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                            <p className="text-base">@{selectedUser.username}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                            <Mail className="mr-1 h-4 w-4" /> Email
                          </h4>
                          <p className="text-base">{selectedUser.email}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                            <Building className="mr-1 h-4 w-4" /> Institution
                          </h4>
                          <p className="text-base">{selectedUser.institution}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                            <Calendar className="mr-1 h-4 w-4" /> Joined
                          </h4>
                          <p className="text-base">
                            {new Date(selectedUser.createdAt).toLocaleDateString()}{" "}
                            ({new Date(selectedUser.createdAt).toLocaleTimeString()})
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="permissions" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Current Role</h4>
                        <Badge
                          className={`${
                            selectedUser.role === "admin"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-primary-50 text-primary-700"
                          } text-sm py-1 px-2`}
                        >
                          {selectedUser.role === "admin" ? (
                            <ShieldCheck className="mr-1 h-4 w-4" />
                          ) : (
                            <User className="mr-1 h-4 w-4" />
                          )}
                          {selectedUser.role === "admin" ? "Administrator" : "Regular User"}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Change Role</h4>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedUser.role === "admin" ? "default" : "outline"}
                            onClick={() => handleRoleChange(selectedUser.id, "admin")}
                            disabled={updateRoleMutation.isPending || selectedUser.role === "admin"}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Make Admin
                          </Button>
                          <Button
                            variant={selectedUser.role === "user" ? "default" : "outline"}
                            onClick={() => handleRoleChange(selectedUser.id, "user")}
                            disabled={updateRoleMutation.isPending || selectedUser.role === "user"}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Make Regular User
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md mt-6">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            <UserCog className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Role permissions</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Administrators</span> have full access to all admin functions, including user management, abstract approval, sending invitations, and creating notifications.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              <span className="font-medium">Regular users</span> can view the conference website, submit abstracts, and manage their own profile.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
