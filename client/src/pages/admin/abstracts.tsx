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
import { Loader2, FileText, Search, CheckCircle, XCircle, Clock, Download, Eye, Filter } from "lucide-react";
import { Abstract } from "@shared/schema";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { getCategoryCode } from "@/lib/abstract-utils";

export default function AdminAbstracts() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAbstract, setSelectedAbstract] = useState<Abstract | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: abstracts, isLoading } = useQuery<Abstract[]>({
    queryKey: ["/api/admin/abstracts"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/abstracts/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The abstract status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/abstracts"] });
      setViewDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredAbstracts = abstracts
    ? abstracts
        .filter((abstract) => {
          if (statusFilter !== "all" && abstract.status !== statusFilter) {
            return false;
          }
          if (searchQuery === "") return true;
          
          return (
            abstract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            abstract.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            abstract.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
            abstract.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : [];

  const handleStatusChange = (abstractId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: abstractId, status: newStatus });
  };

  const viewAbstract = (abstract: Abstract) => {
    setSelectedAbstract(abstract);
    setViewDialogOpen(true);
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
      title="Manage Abstracts"
      description="Review and manage conference abstract submissions"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Abstract Submissions</CardTitle>
            <CardDescription>
              {abstracts?.length} total abstracts submitted
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search abstracts..."
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
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredAbstracts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbstracts.map((abstract) => (
                    <TableRow key={abstract.id}>                      <TableCell className="font-medium">
                        {abstract.referenceId || `${getCategoryCode(abstract.category)}-${abstract.id.toString().padStart(4, '0')}`}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {abstract.title}
                      </TableCell>
                      <TableCell>{abstract.category}</TableCell>
                      <TableCell>
                        {new Date(abstract.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(abstract.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewAbstract(abstract)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {abstract.fileUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(abstract.fileUrl, "_blank")}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              File
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No abstracts found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No abstracts have been submitted yet"}
              </p>
            </div>
          )}

          {/* Abstract Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">              <DialogHeader>
                <DialogTitle>{selectedAbstract?.title}</DialogTitle>
                <DialogDescription>
                  ID: {selectedAbstract?.referenceId || (selectedAbstract && `${getCategoryCode(selectedAbstract.category)}-${selectedAbstract.id.toString().padStart(4, '0')}`)} | Submitted on {selectedAbstract?.createdAt && new Date(selectedAbstract.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Category</h4>
                  <p className="text-sm">{selectedAbstract?.category}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Keywords</h4>
                  <p className="text-sm">{selectedAbstract?.keywords}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Authors</h4>
                  <p className="text-sm">{selectedAbstract?.authors}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Abstract</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {selectedAbstract && <MarkdownRenderer content={selectedAbstract.content || ''} />}
                  </div>
                </div>

                {selectedAbstract?.fileUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Attached File</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedAbstract.fileUrl, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Current Status</h4>
                  <div className="flex items-center">
                    {selectedAbstract && getStatusBadge(selectedAbstract.status)}
                    <span className="ml-2 text-sm text-gray-500">
                      Last updated: {selectedAbstract?.updatedAt && new Date(selectedAbstract.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Update Status</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedAbstract?.status === "accepted" ? "default" : "outline"}
                      onClick={() => selectedAbstract && handleStatusChange(selectedAbstract.id, "accepted")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant={selectedAbstract?.status === "rejected" ? "default" : "outline"}
                      onClick={() => selectedAbstract && handleStatusChange(selectedAbstract.id, "rejected")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      variant={selectedAbstract?.status === "pending" ? "default" : "outline"}
                      onClick={() => selectedAbstract && handleStatusChange(selectedAbstract.id, "pending")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as Pending
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewDialogOpen(false)}
                >
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
