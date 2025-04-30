import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProfileSchema, Profile } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { Loader2, Save } from "lucide-react";

// Create a formatted schema for the profile form
const profileFormSchema = z.object({
  bio: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  researchInterests: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    orcid: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm({ profile }: { profile?: Profile }) {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile
      ? {
          bio: profile.bio || "",
          title: profile.title || "",
          department: profile.department || "",
          researchInterests: profile.researchInterests || "",
          website: profile.website || "",
          socialLinks: {
            twitter: profile.socialLinks?.twitter || "",
            linkedin: profile.socialLinks?.linkedin || "",
            github: profile.socialLinks?.github || "",
            orcid: profile.socialLinks?.orcid || "",
          },
        }
      : {
          bio: "",
          title: "",
          department: "",
          researchInterests: "",
          website: "",
          socialLinks: {
            twitter: "",
            linkedin: "",
            github: "",
            orcid: "",
          },
        },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Professor, Research Scholar, PhD Student" {...field} />
                </FormControl>
                <FormDescription>
                  Your academic or professional title
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Statistics, Computer Science" {...field} />
                </FormControl>
                <FormDescription>
                  Your department or field of study
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself and your professional background"
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your professional background
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="researchInterests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Research Interests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Machine Learning, Bayesian Statistics, Time Series Analysis"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your key research areas or topics of interest
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal/Academic Website</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormDescription>
                Your personal or institutional website
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="socialLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter/X</FormLabel>
                  <FormControl>
                    <Input placeholder="@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="LinkedIn username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="GitHub username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.orcid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ORCID</FormLabel>
                  <FormControl>
                    <Input placeholder="ORCID ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}