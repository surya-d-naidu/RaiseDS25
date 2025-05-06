import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertInvitationSchema } from "@shared/schema";
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
import { Loader2, Send } from "lucide-react";

// Create a formatted schema for the invitation form
const invitationFormSchema = insertInvitationSchema.extend({
  expiresAt: z.union([
    z.date(),
    z.string().transform((val) => val ? new Date(val) : undefined),
    z.null(),
    z.undefined()
  ]),
});

type InvitationFormValues = z.infer<typeof invitationFormSchema>;

export default function InvitationForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      type: "account",
      message: "",
      expiresAt: "",
      institution: "",
      position: "",
    },
  });

  const invitationMutation = useMutation({
    mutationFn: async (data: InvitationFormValues) => {
      const res = await apiRequest("POST", "/api/invitations", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "The invitation has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Invitation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: InvitationFormValues) {
    // Prepare data for submission
    const formData = {
      ...values,
      // Convert empty string to null/undefined for the backend
      expiresAt: values.expiresAt && values.expiresAt instanceof Date ? values.expiresAt : 
                (values.expiresAt === "" ? undefined : values.expiresAt)
    };
    
    invitationMutation.mutate(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The invitation will be sent to this email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset role to user if type is attendance
                  if (value === "attendance") {
                    form.setValue("role", "guest");
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invitation type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="account">Account Registration</SelectItem>
                  <SelectItem value="attendance">Attendance Confirmation</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Account Registration: Invites to create an account on the platform.
                Attendance Confirmation: Simple RSVP for delegates and guests.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === "account" && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invited Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">Regular User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The role they will have upon accepting the invitation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="We would like to invite you to participate in our upcoming conference..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add a personal note to the invitation email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === "attendance" && (
          <>
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution/Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="University of Science" {...field} />
                  </FormControl>
                  <FormDescription>
                    The institution or organization the guest is affiliated with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Professor of Computer Science" {...field} />
                  </FormControl>
                  <FormDescription>
                    The guest's position or title at their institution.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If not specified, the invitation will expire in 14 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={invitationMutation.isPending}
        >
          {invitationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
