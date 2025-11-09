import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Upload, Eye, Camera, ExternalLink } from "lucide-react";
import { InvitedSpeaker } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const speakerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  position: z.string().min(1, "Position is required"),
  institution: z.string().min(1, "Institution is required"),
  country: z.string().min(1, "Country is required"),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  talkTitle: z.string().optional(),
  talkAbstract: z.string().optional(),
  isKeynote: z.boolean().default(false),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

type SpeakerFormData = z.infer<typeof speakerFormSchema>;

export default function AdminInvitedSpeakers() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<InvitedSpeaker | null>(null);
  const [imageUploadSpeakerId, setImageUploadSpeakerId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { data: speakers, isLoading } = useQuery<InvitedSpeaker[]>({
    queryKey: ["/api/admin/invited-speakers"],
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SpeakerFormData>({
    resolver: zodResolver(speakerFormSchema),
    defaultValues: {
      isKeynote: false,
      displayOrder: 0,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SpeakerFormData) => {
      const res = await apiRequest("POST", "/api/admin/invited-speakers", data);
      return await res.json();
    },
    onSuccess: async (newSpeaker) => {
      // If there's a selected image, upload it
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('image', selectedImage);
          await apiRequest("POST", `/api/admin/invited-speakers/${newSpeaker.id}/image`, formData);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({ 
            title: "Warning", 
            description: "Speaker created but image upload failed", 
            variant: "destructive" 
          });
        }
      }
      
      toast({ title: "Success", description: "Speaker created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invited-speakers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invited-speakers"] });
      setDialogOpen(false);
      reset();
      setSelectedImage(null);
      setSelectedImagePreview(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SpeakerFormData> }) => {
      const res = await apiRequest("PUT", `/api/admin/invited-speakers/${id}`, data);
      return await res.json();
    },
    onSuccess: async (updatedSpeaker) => {
      // If there's a selected image, upload it
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('image', selectedImage);
          await apiRequest("POST", `/api/admin/invited-speakers/${updatedSpeaker.id}/image`, formData);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({ 
            title: "Warning", 
            description: "Speaker updated but image upload failed", 
            variant: "destructive" 
          });
        }
      }
      
      toast({ title: "Success", description: "Speaker updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invited-speakers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invited-speakers"] });
      setDialogOpen(false);
      setEditingSpeaker(null);
      reset();
      setSelectedImage(null);
      setSelectedImagePreview(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/invited-speakers/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Speaker deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invited-speakers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invited-speakers"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiRequest("POST", `/api/admin/invited-speakers/${id}/image`, formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Speaker image uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invited-speakers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invited-speakers"] });
      setImageUploadSpeakerId(null);
      setSelectedImage(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: SpeakerFormData) => {
    if (editingSpeaker) {
      updateMutation.mutate({ id: editingSpeaker.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (speaker: InvitedSpeaker) => {
    setEditingSpeaker(speaker);
    reset({
      name: speaker.name,
      title: speaker.title,
      position: speaker.position,
      institution: speaker.institution,
      country: speaker.country,
      bio: speaker.bio || "",
      expertise: speaker.expertise || "",
      linkedinUrl: speaker.linkedinUrl || "",
      websiteUrl: speaker.websiteUrl || "",
      talkTitle: speaker.talkTitle || "",
      talkAbstract: speaker.talkAbstract || "",
      isKeynote: speaker.isKeynote,
      displayOrder: speaker.displayOrder,
      isActive: speaker.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (speaker: InvitedSpeaker) => {
    if (confirm(`Are you sure you want to delete ${speaker.name}?`)) {
      deleteMutation.mutate(speaker.id);
    }
  };

  const handleImageUpload = () => {
    if (selectedImage && imageUploadSpeakerId) {
      imageUploadMutation.mutate({ id: imageUploadSpeakerId, file: selectedImage });
    }
  };

  const openDialog = () => {
    setEditingSpeaker(null);
    reset();
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setDialogOpen(true);
  };

  return (
    <AdminLayout
      title="Invited Speakers"
      description="Manage invited speakers for the conference"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invited Speakers</CardTitle>
            <CardDescription>
              {speakers?.length || 0} speakers configured
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Speaker
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSpeaker ? "Edit Speaker" : "Add New Speaker"}
                </DialogTitle>
                <DialogDescription>
                  {editingSpeaker 
                    ? "Update the speaker information below" 
                    : "Fill in the speaker details below"
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedImagePreview && (
                      <div className="relative w-32 h-32">
                        <img
                          src={selectedImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input {...register("title")} placeholder="Dr., Prof., etc." />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input {...register("position")} placeholder="Professor, Director, etc." />
                    {errors.position && (
                      <p className="text-sm text-red-500">{errors.position.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input {...register("institution")} />
                    {errors.institution && (
                      <p className="text-sm text-red-500">{errors.institution.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input {...register("country")} />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea {...register("bio")} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Textarea {...register("expertise")} rows={2} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input {...register("linkedinUrl")} type="url" />
                    {errors.linkedinUrl && (
                      <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input {...register("websiteUrl")} type="url" />
                    {errors.websiteUrl && (
                      <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="talkTitle">Talk Title</Label>
                  <Input {...register("talkTitle")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="talkAbstract">Talk Abstract</Label>
                  <Textarea {...register("talkAbstract")} rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input {...register("displayOrder", { valueAsNumber: true })} type="number" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch {...register("isKeynote")} />
                    <Label htmlFor="isKeynote">Keynote Speaker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch {...register("isActive")} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

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
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingSpeaker ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : speakers && speakers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {speakers.map((speaker) => (
                    <TableRow key={speaker.id}>
                      <TableCell>
                        <div className="relative">
                          {speaker.image ? (
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {speaker.title} {speaker.name}
                          </div>
                          <div className="text-sm text-gray-500">{speaker.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>{speaker.position}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {speaker.institution}
                      </TableCell>
                      <TableCell>
                        <Badge variant={speaker.isKeynote ? "default" : "secondary"}>
                          {speaker.isKeynote ? "Keynote" : "Invited"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={speaker.isActive ? "default" : "secondary"}>
                          {speaker.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Speaker Image</DialogTitle>
                                <DialogDescription>
                                  Upload an image for {speaker.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setSelectedImage(e.target.files?.[0] || null);
                                    setImageUploadSpeakerId(speaker.id);
                                  }}
                                />
                                {selectedImage && (
                                  <div className="text-sm text-gray-600">
                                    Selected: {selectedImage.name}
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={handleImageUpload}
                                  disabled={!selectedImage || imageUploadMutation.isPending}
                                >
                                  {imageUploadMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Upload
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(speaker)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(speaker)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No invited speakers configured yet.</p>
              <Button onClick={openDialog} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Speaker
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
