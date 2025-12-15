import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, Loader2, FileText } from "lucide-react";

interface FullPaperUploadProps {
  abstractId: number;
  isReplacement: boolean;
}

export default function FullPaperUpload({ abstractId, isReplacement }: FullPaperUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest("POST", `/api/abstracts/${abstractId}/full-paper`, formData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: isReplacement ? "Full paper updated successfully" : "Full paper uploaded successfully",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({ queryKey: ["/api/abstracts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Only PDF files are allowed for full papers",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={`fullPaper-${abstractId}`} className="text-sm">
          {isReplacement ? "Replace Full Paper (PDF only)" : "Upload Full Paper (PDF only)"}
        </Label>
        <Input
          id={`fullPaper-${abstractId}`}
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="mt-1"
          disabled={uploadMutation.isPending}
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFile}
              disabled={uploadMutation.isPending}
            >
              Remove
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isReplacement ? "Replace" : "Upload"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        • Maximum file size: 10MB<br />
        • Only PDF files are accepted<br />
        • Paper should not exceed 10 pages including references
      </p>
    </div>
  );
}
