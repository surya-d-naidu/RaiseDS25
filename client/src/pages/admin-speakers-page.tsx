import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users, Globe, Linkedin, Twitter, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Speaker {
  id: number;
  name: string;
  title?: string;
  institution?: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  category: string;
  order: number;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  isActive: boolean;
}

interface SpeakerFormData {
  name: string;
  title: string;
  institution: string;
  country: string;
  bio: string;
  imageUrl: string;
  category: string;
  order: number;
  website: string;
  linkedin: string;
  twitter: string;
  email: string;
  isActive: boolean;
}

const categories = [
  { value: "keynote", label: "Keynote Speaker" },
  { value: "invited", label: "Invited Speaker" },
  { value: "panel", label: "Panel Speaker" },
  { value: "workshop", label: "Workshop Speaker" }
];

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<SpeakerFormData>({
    name: "",
    title: "",
    institution: "",
    country: "",
    bio: "",
    imageUrl: "",
    category: "keynote",
    order: 0,
    website: "",
    linkedin: "",
    twitter: "",
    email: "",
    isActive: true
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch('/api/speakers');
      if (response.ok) {
        const data = await response.json();
        setSpeakers(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch speakers",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch speakers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      institution: "",
      country: "",
      bio: "",
      imageUrl: "",
      category: "keynote",
      order: speakers.length + 1,
      website: "",
      linkedin: "",
      twitter: "",
      email: "",
      isActive: true
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingSpeaker(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (speaker: Speaker) => {
    setFormData({
      name: speaker.name,
      title: speaker.title || "",
      institution: speaker.institution || "",
      country: speaker.country || "",
      bio: speaker.bio || "",
      imageUrl: speaker.imageUrl || "",
      category: speaker.category,
      order: speaker.order,
      website: speaker.socialLinks?.website || "",
      linkedin: speaker.socialLinks?.linkedin || "",
      twitter: speaker.socialLinks?.twitter || "",
      email: speaker.socialLinks?.email || "",
      isActive: speaker.isActive
    });
    setEditingSpeaker(speaker);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const speakerData = {
      name: formData.name,
      title: formData.title || null,
      institution: formData.institution || null,
      country: formData.country || null,
      bio: formData.bio || null,
      imageUrl: formData.imageUrl || null,
      category: formData.category,
      order: formData.order,
      socialLinks: {
        website: formData.website || undefined,
        linkedin: formData.linkedin || undefined,
        twitter: formData.twitter || undefined,
        email: formData.email || undefined
      },
      isActive: formData.isActive
    };

    try {
      const url = editingSpeaker 
        ? `/api/admin/speakers/${editingSpeaker.id}`
        : '/api/admin/speakers';
      
      const method = editingSpeaker ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(speakerData),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Speaker ${editingSpeaker ? 'updated' : 'created'} successfully`
        });
        setIsDialogOpen(false);
        fetchSpeakers();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || `Failed to ${editingSpeaker ? 'update' : 'create'} speaker`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingSpeaker ? 'update' : 'create'} speaker`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (speakerId: number) => {
    try {
      const response = await fetch(`/api/admin/speakers/${speakerId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Speaker deleted successfully"
        });
        fetchSpeakers();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete speaker",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete speaker",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading speakers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Manage Speakers
          </h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage conference speakers</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Speaker
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Keynote Speaker"
                  />
                </div>
                
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/speakers/speaker-name.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website" className="text-sm">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="speaker@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSpeaker ? 'Update' : 'Create'} Speaker
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker) => (
          <Card key={speaker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={speaker.imageUrl} alt={speaker.name} />
                <AvatarFallback className="text-lg">
                  {speaker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{speaker.name}</CardTitle>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge variant="secondary">{speaker.category}</Badge>
                {!speaker.isActive && <Badge variant="destructive">Inactive</Badge>}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {speaker.title && (
                <p className="text-sm"><strong>Title:</strong> {speaker.title}</p>
              )}
              {speaker.institution && (
                <p className="text-sm"><strong>Institution:</strong> {speaker.institution}</p>
              )}
              {speaker.country && (
                <p className="text-sm"><strong>Country:</strong> {speaker.country}</p>
              )}
              {speaker.bio && (
                <p className="text-xs text-gray-600 line-clamp-3">{speaker.bio}</p>
              )}
              
              {speaker.socialLinks && (
                <div className="flex gap-2 justify-center pt-2">
                  {speaker.socialLinks.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={speaker.socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {speaker.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={speaker.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {speaker.socialLinks.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={speaker.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {speaker.socialLinks.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${speaker.socialLinks.email}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(speaker)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Speaker</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {speaker.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(speaker.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {speakers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No speakers yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your first speaker to the conference.</p>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Speaker
          </Button>
        </div>
      )}
    </div>
  );
}
