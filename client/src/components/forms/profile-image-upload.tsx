import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Camera, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  userName: string;
}

export default function ProfileImageUpload({ currentImageUrl, userName }: ProfileImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await apiRequest("POST", "/api/profile/upload-image", formData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/profile/delete-image");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      deleteMutation.mutate();
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white shadow-md hover:bg-gray-50"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or remove your current one
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current/Preview Image */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-gray-100">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Preview" />
              ) : currentImageUrl ? (
                <AvatarImage src={currentImageUrl} alt={userName} />
              ) : (
                <AvatarFallback className="text-2xl">{getInitials(userName)}</AvatarFallback>
              )}
            </Avatar>
            
            {previewUrl && (
              <p className="text-sm text-gray-600">Preview of new image</p>
            )}
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="profile-image-input"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending || deleteMutation.isPending}
            >
              Choose Image
            </Button>
            <p className="text-xs text-gray-500 text-center">
              PNG, JPG or GIF (max. 5MB)
            </p>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-900 truncate">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetSelection}
                  disabled={uploadMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-blue-700">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || deleteMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload New Picture"
                )}
              </Button>
            )}
            
            {currentImageUrl && !selectedFile && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={uploadMutation.isPending || deleteMutation.isPending}
                className="w-full"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Picture"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
