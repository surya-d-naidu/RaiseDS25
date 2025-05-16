import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Award, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { ResearchAward } from "@shared/schema";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  eligibility: z.string().min(1, "Eligibility criteria is required"),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminAwards() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<ResearchAward | null>(null);

  const { data: awards, isLoading } = useQuery<ResearchAward[]>({
    queryKey: ["/api/admin/awards"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      eligibility: "",
      amount: "",
      deadline: "",
      isActive: true,
    },
  });

  const createAwardMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform date string to ISO string if provided
      const payload = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      };

      const response = await apiRequest(
        "POST", 
        "/api/admin/awards", 
        payload
      );
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Award created",
        description: "Research award has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/awards"] });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create award",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAwardMutation = useMutation({
    mutationFn: async (data: FormValues & { id: number }) => {
      const { id, ...updateData } = data;
      
      // Transform date string to ISO string if provided
      const payload = {
        ...updateData,
        deadline: updateData.deadline ? new Date(updateData.deadline).toISOString() : undefined,
      };
      
      const response = await apiRequest(
        "PUT", 
        `/api/admin/awards/${id}`, 
        payload
      );
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Award updated",
        description: "Research award has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/awards"] });
      setDialogOpen(false);
      setEditingAward(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update award",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAwardMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/awards/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Award deleted",
        description: "Research award has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/awards"] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete award",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (award: ResearchAward) => {
    setEditingAward(award);
    form.reset({
      title: award.title,
      description: award.description,
      eligibility: award.eligibility,
      amount: award.amount || "",
      deadline: award.deadline ? new Date(award.deadline).toISOString().substring(0, 10) : "",
      isActive: award.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (award: ResearchAward) => {
    setEditingAward(award);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editingAward) {
      updateAwardMutation.mutate({ ...data, id: editingAward.id });
    } else {
      createAwardMutation.mutate(data);
    }
  };

  const handleOpenDialog = () => {
    setEditingAward(null);
    form.reset({
      title: "",
      description: "",
      eligibility: "",
      amount: "",
      deadline: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  const filteredAwards = awards
    ? awards.filter((award) => {
        if (searchQuery === "") return true;
        return (
          award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          award.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          award.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  return (
    <AdminLayout
      title="Manage Research Awards"
      description="Create, update, and delete research awards for the conference"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Research Awards</CardTitle>
            <CardDescription>
              {awards?.length} total awards available
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search awards..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Award
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredAwards.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAwards.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell className="font-medium">{award.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{award.description}</TableCell>
                      <TableCell>{award.amount || "N/A"}</TableCell>
                      <TableCell>
                        {award.deadline
                          ? format(new Date(award.deadline), "MMM d, yyyy")
                          : "No deadline"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            award.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {award.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(award)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(award)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
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
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No awards found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "No research awards have been created yet"}
              </p>
              {!searchQuery && (
                <Button onClick={handleOpenDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Award
                </Button>
              )}
            </div>
          )}

          {/* Create/Edit Award Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingAward ? "Edit Research Award" : "Create Research Award"}
                </DialogTitle>
                <DialogDescription>
                  {editingAward
                    ? "Update the details of this research award"
                    : "Add a new research award to the conference"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Young Researcher Award" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of the award..."
                            {...field}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Criteria</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Who is eligible for this award..."
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="₹50,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Whether this award is currently active and visible on the website
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createAwardMutation.isPending || updateAwardMutation.isPending}
                    >
                      {createAwardMutation.isPending || updateAwardMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {editingAward ? "Update Award" : "Create Award"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the "{editingAward?.title}" award? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleteAwardMutation.isPending}
                  onClick={() => {
                    if (editingAward) {
                      deleteAwardMutation.mutate(editingAward.id);
                    }
                  }}
                >
                  {deleteAwardMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Delete Award
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
