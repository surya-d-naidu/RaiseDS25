import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, Mail, Search, Filter, CheckCircle, XCircle, Clock, Trash2, Send } from "lucide-react";
import { Invitation } from "@shared/schema";
import InvitationForm from "@/components/forms/invitation-form";

export default function AdminInvitations() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: invitations, isLoading } = useQuery<Invitation[]>({
    queryKey: ["/api/invitations"],
  });

  const deleteInvitationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/invitations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Invitation deleted",
        description: "The invitation has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
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

  const filteredInvitations = invitations
    ? invitations
        .filter((invitation) => {
          if (statusFilter !== "all" && invitation.status !== statusFilter) {
            return false;
          }
          if (searchQuery === "") return true;
          
          return (
            invitation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (invitation.message && invitation.message.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const handleDeleteInvitation = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvitation) {
      deleteInvitationMutation.mutate(selectedInvitation.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout
      title="Manage Invitations"
      description="Send and track invitations to the conference"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>
              {invitations?.length || 0} invitations sent
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search invitations..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredInvitations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.name}
                      </TableCell>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell className="capitalize">{invitation.role}</TableCell>
                      <TableCell>
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvitation(invitation)}
                          disabled={deleteInvitationMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No invitations found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No invitations have been sent yet"}
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send Your First Invitation
              </Button>
            </div>
          )}

          {/* Create Invitation Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send New Invitation</DialogTitle>
                <DialogDescription>
                  Invite someone to participate in the conference
                </DialogDescription>
              </DialogHeader>
              <InvitationForm onSuccess={() => setCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Invitation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this invitation?
                </DialogDescription>
              </DialogHeader>
              
              {selectedInvitation && (
                <div className="py-4">
                  <p className="text-sm text-gray-500 mb-4">
                    You are about to delete the invitation for:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedInvitation.name}</p>
                    <p className="text-sm text-gray-600">{selectedInvitation.email}</p>
                    <div className="mt-2">
                      {getStatusBadge(selectedInvitation.status)}
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
                  disabled={deleteInvitationMutation.isPending}
                >
                  {deleteInvitationMutation.isPending ? (
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
