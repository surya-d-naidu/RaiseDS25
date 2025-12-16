import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle, Info } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const fullPaperSchema = z.object({
  abstractId: z.string().min(1, "Abstract ID is required"),
  file: z.custom<FileList>()
    .refine((files) => files?.length === 1, "PDF file is required")
    .refine((files) => {
      const file = files?.[0];
      return file?.type === "application/pdf";
    }, "Only PDF files are accepted")
    .refine((files) => {
      const file = files?.[0];
      return file?.size <= MAX_FILE_SIZE;
    }, "File size must be less than 5MB"),
});

type FullPaperFormValues = z.infer<typeof fullPaperSchema>;

export default function FullPaperSubmissionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  // Feature flag to disable uploads
  const uploadsDisabled = true;

  const form = useForm<FullPaperFormValues>({
    resolver: zodResolver(fullPaperSchema),
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { abstractId: string; file: File }) => {
      if (uploadsDisabled) throw new Error('Full paper uploads are disabled');

      const formData = new FormData();
      formData.append("file", data.file);

      const response = await fetch(`/api/abstracts/${data.abstractId}/full-paper`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload full paper");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your full paper has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/abstracts"] });
      form.reset();
      setSelectedFileName("");
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FullPaperFormValues) => {
    if (uploadsDisabled) {
      toast({ title: 'Uploads disabled', description: 'Full paper uploads are currently disabled.', variant: 'destructive' });
      return;
    }

    const file = values.file[0];
    setUploadProgress(true);
    uploadMutation.mutate(
      { abstractId: values.abstractId, file },
      {
        onSettled: () => setUploadProgress(false),
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        form.setError("file", {
          message: "File size must be less than 5MB",
        });
      } else if (file.type !== "application/pdf") {
        form.setError("file", {
          message: "Only PDF files are accepted",
        });
      } else {
        form.clearErrors("file");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit Full Paper | RAISE DS 2025</title>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Submit Full-Length Paper</h1>
            <p className="mt-2 text-gray-600">
              Upload your full-length paper for your accepted abstract
            </p>
          </div>

          {/* Information Alert */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Full paper should be <strong>12 to 15 pages</strong> maximum, including references</li>
                <li>File format: <strong>PDF only</strong></li>
                <li>Maximum file size: <strong>5 MB</strong></li>
                <li>You need the Abstract ID from your accepted abstract submission</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Full Paper
              </CardTitle>
              <CardDescription>
                Enter your abstract ID and upload your full-length paper document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Abstract ID Field */}
                  <FormField
                    control={form.control}
                    name="abstractId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abstract ID *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your abstract ID (e.g., ABS001)"
                            {...field}
                            className="max-w-md"
                          />
                        </FormControl>
                        <FormDescription>
                          The unique ID assigned to your accepted abstract
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload Field */}
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Full Paper (PDF) *</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={(e) => {
                                  onChange(e.target.files);
                                  handleFileChange(e);
                                }}
                                {...field}
                                className="max-w-md"
                              />
                            </div>
                            {selectedFileName && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md max-w-md">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="truncate">{selectedFileName}</span>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload your full paper in PDF format (12-15 pages, max 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={uploadProgress || uploadMutation.isPending}
                      className="min-w-[200px]"
                    >
                      {uploadProgress || uploadMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Full Paper
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Success/Error Messages */}
                  {uploadMutation.isSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900">
                        Your full paper has been uploaded successfully! You can view it in your profile.
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadMutation.isError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-900">
                        {uploadMutation.error?.message || "Failed to upload full paper. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Guidelines Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Page Limit</p>
                  <p>Your full paper must be between 12 and 15 pages, including all references and appendices.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Format</p>
                  <p>Ensure proper formatting of headings, citations, and references.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">File Requirements</p>
                  <p>Save your document as a PDF file with a size under 5MB. Ensure all fonts are embedded.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Abstract ID</p>
                  <p>Make sure to use the correct Abstract ID. This can be found in your abstract submission confirmation or profile page.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}
