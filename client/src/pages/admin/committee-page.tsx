import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CommitteeMember } from "@shared/schema";

export default function AdminCommitteePage() {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CommitteeMember>>({
    name: "",
    role: "",
    institution: "",
    country: "",
    category: "",
    email: "",
    phone: "",
    order: 0,
    profileLink: "",
    image: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
    fetch("/api/committee")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setCommitteeMembers(data);
        } else {
          console.error("API returned non-array data:", data);
          setCommitteeMembers([]);
          toast({ title: "Invalid data format received from server", variant: "destructive" });
        }
      })
      .catch((error) => {
        console.error("Error fetching committee members:", error);
        toast({ title: "Error fetching committee members", variant: "destructive" });
      });
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id ? `/api/admin/committee/${formData.id}` : "/api/admin/committee";
      
      // Submit the member data first
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save committee member");
      }
      
      const savedMember = await response.json();
      
      // If we have a new image selected, upload it
      if (selectedImage && savedMember.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        
        const imageResponse = await fetch(`/api/admin/committee/${savedMember.id}/image`, {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!imageResponse.ok) {
          toast({ 
            title: "Member saved but image upload failed", 
            description: "The committee member was created, but there was an issue uploading the image.",
            variant: "warning" 
          });
          // Update UI with the member data we have
          setCommitteeMembers((prev) =>
            formData.id
              ? prev.map((member) => (member.id === savedMember.id ? savedMember : member))
              : [...prev, savedMember]
          );
          setIsDialogOpen(false);
          return;
        }
        
        const imageData = await imageResponse.json();
        // Update the saved member with the image path
        savedMember.image = imageData.imagePath;
      }
      
      // Update the UI with the complete member data
      setCommitteeMembers((prev) =>
        formData.id
          ? prev.map((member) => (member.id === savedMember.id ? savedMember : member))
          : [...prev, savedMember]
      );
      
      setIsDialogOpen(false);
      toast({ title: "Committee member saved successfully" });
      
      // Reset the selected image
      setSelectedImage(null);
      
    } catch (error) {
      console.error("Error saving committee member:", error);
      toast({ title: "Error saving committee member", variant: "destructive" });
    }
  };

  const handleDelete = (id: number) => {
    fetch(`/api/admin/committee/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete committee member");
        setCommitteeMembers((prev) => prev.filter((member) => member.id !== id));
        toast({ title: "Committee member deleted successfully" });
      })
      .catch(() => toast({ title: "Error deleting committee member", variant: "destructive" }));
  };

  // Filter members based on selected category and search query
  const filteredMembers = Array.isArray(committeeMembers) ? committeeMembers.filter(member => {
    if (!member) return false;
    
    const matchesCategory = filterCategory === "all" || member.category === filterCategory;
    const matchesSearch = searchQuery === "" || 
      (member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (member.institution && member.institution.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }) : [];

  // Sort members by order field then by name
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order || 0) - (b.order || 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Committee Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="chief_patron">Chief Patron</SelectItem>
                <SelectItem value="patron">Patron</SelectItem>
                <SelectItem value="organizing_committee">Organizing Committee</SelectItem>
                <SelectItem value="advisory_committee">Advisory Committee</SelectItem>
                <SelectItem value="isps_executive">ISPS Executive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => {
              setFormData({
                name: "",
                role: "",
                institution: "",
                country: "",
                category: "",
                email: "",
                phone: "",
                order: 0,
                profileLink: "",
                image: ""
              });
              setSelectedImage(null);
              setIsDialogOpen(true);
            }}>Add Member</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Profile Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.length > 0 ? (
                  sortedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.image ? (
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={`${member.name}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {member.category.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell>{member.institution}</TableCell>
                      <TableCell>{member.order}</TableCell>
                      <TableCell>
                        {member.profileLink ? (
                          <a 
                            href={member.profileLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            View Profile
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(member);
                              setIsDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No committee members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Member" : "Add Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                placeholder="Role or Position"
                value={formData.role || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chief_patron">Chief Patron</SelectItem>
                  <SelectItem value="patron">Patron</SelectItem>
                  <SelectItem value="organizing_committee">Organizing Committee</SelectItem>
                  <SelectItem value="advisory_committee">Advisory Committee</SelectItem>
                  <SelectItem value="isps_executive">ISPS Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Institution or Affiliation"
                value={formData.institution || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="Country"
                value={formData.country || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profileLink">Profile Link</Label>
              <Input
                id="profileLink"
                name="profileLink"
                placeholder="URL to member's profile page"
                value={formData.profileLink || ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500">Link to personal webpage or professional profile</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                placeholder="Display order (lower numbers appear first)"
                value={formData.order || 0}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex items-center gap-4">
                {(formData.image || selectedImage) && (
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={selectedImage ? URL.createObjectURL(selectedImage) : formData.image} 
                      alt="Member" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-xs text-gray-500">Upload a profile photo (JPG or PNG recommended)</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}