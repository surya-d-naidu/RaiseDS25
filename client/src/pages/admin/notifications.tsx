import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Bell, Info, AlertCircle, Clock, Pencil, Trash2, Eye, Plus } from "lucide-react";
import { Notification } from "@shared/schema";
import NotificationForm from "@/components/forms/notification-form";

export default function AdminNotifications() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/admin/notifications"],
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/notifications/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Notification deleted",
        description: "The notification has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/notifications/${id}`, { isActive });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The notification status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredNotifications = notifications
    ? notifications
        .filter((notification) => {
          if (typeFilter !== "all" && notification.type !== typeFilter) {
            return false;
          }
          if (searchQuery === "") return true;
          
          return (
            notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const handleDeleteNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      deleteNotificationMutation.mutate(selectedNotification.id);
    }
  };

  const handleToggleStatus = (notification: Notification) => {
    toggleStatusMutation.mutate({
      id: notification.id,
      isActive: !notification.isActive,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "important":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout
      title="Manage Notifications"
      description="Create and manage notification messages for conference attendees"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {notifications?.length || 0} notification messages
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {notification.content}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            notification.type === "important"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : notification.type === "deadline"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {getTypeIcon(notification.type)}
                          <span className="ml-1 capitalize">{notification.type}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={notification.isActive}
                          onCheckedChange={() => handleToggleStatus(notification)}
                          disabled={toggleStatusMutation.isPending}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotification(notification)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification)}
                            disabled={deleteNotificationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || typeFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No notifications have been created yet"}
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Notification
              </Button>
            </div>
          )}

          {/* Create Notification Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogDescription>
                  Create a new notification to display on the conference website
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <NotificationForm onSuccess={() => setCreateDialogOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Notification Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Notification</DialogTitle>
                <DialogDescription>
                  Update the notification details
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <NotificationForm
                  notification={selectedNotification}
                  onSuccess={() => setEditDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Delete Notification</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this notification?
                </DialogDescription>
              </DialogHeader>
              
              {selectedNotification && (
                <div className="py-4">
                  <p className="text-sm text-gray-500 mb-4">
                    You are about to delete the following notification:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedNotification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedNotification.content}</p>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`${
                          selectedNotification.type === "important"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : selectedNotification.type === "deadline"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {getTypeIcon(selectedNotification.type)}
                        <span className="ml-1 capitalize">{selectedNotification.type}</span>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    This action cannot be undone.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleteNotificationMutation.isPending}
                >
                  {deleteNotificationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
