import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAbstractSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, FileText, Upload } from "lucide-react";

const categoryOptions = [
  "Statistical Methods",
  "Machine Learning",
  "Data Visualization",
  "Probability Theory",
  "Computational Statistics",
  "Bayesian Analysis",
  "Time Series Analysis",
  "Big Data Analytics",
  "Applied Statistics",
  "Other"
];

// No file validation needed anymore
const abstractFormSchema = insertAbstractSchema;

type AbstractFormValues = z.infer<typeof abstractFormSchema>;

export default function AbstractForm({ abstract }: { abstract?: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AbstractFormValues>({
    resolver: zodResolver(abstractFormSchema),
    defaultValues: abstract
      ? {
          title: abstract.title,
          category: abstract.category,
          content: abstract.content,
          keywords: abstract.keywords,
        }
      : {
          title: "",
          category: "",
          content: "",
          keywords: "",
        },
  });

  const abstractMutation = useMutation({
    mutationFn: async (data: AbstractFormValues) => {
      setIsSubmitting(true);
      // Use the apiRequest function as we don't need FormData anymore
      const response = await apiRequest(
        abstract ? "PUT" : "POST", 
        abstract ? `/api/abstracts/${abstract.id}` : "/api/abstracts", 
        data
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: abstract ? "Abstract updated" : "Abstract submitted",
        description: abstract 
          ? "Your abstract has been updated successfully." 
          : "Your abstract has been submitted successfully and is pending review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/abstracts"] });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: abstract ? "Update failed" : "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: AbstractFormValues) {
    abstractMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of your abstract" {...field} />
              </FormControl>
              <FormDescription>
                Provide a clear and concise title for your research.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Research Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for your research" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your research.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your abstract (300-500 words)"
                  className="resize-none min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include research problem, methodology, results, and conclusions. 300-500 words recommended.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., statistics, machine learning, data visualization"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide 3-5 keywords separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />



        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important submission guidelines</AlertTitle>
          <AlertDescription>
            At least one author must register for the conference to present the paper. 
            Abstract submissions without subsequent registration will not be included in the conference program.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {abstract ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {abstract ? "Update Abstract" : "Submit Abstract"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
