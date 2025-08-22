import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, Send, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

// Schema for bulk invitation form
const bulkInvitationFormSchema = z.object({
  emails: z.string().min(1, "Email list is required"),
  role: z.enum(["user", "admin", "guest"]).default("user"),
  type: z.enum(["account", "attendance"]).default("account"),
  message: z.string().optional(),
  expiresAt: z.union([
    z.date(),
    z.string().transform((val) => val ? new Date(val) : undefined),
    z.null(),
    z.undefined()
  ]).optional(),
  institution: z.string().optional(),
  position: z.string().optional(),
});

type BulkInvitationFormValues = z.infer<typeof bulkInvitationFormSchema>;

interface BulkInvitationResult {
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

export default function BulkInvitationForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailCount, setEmailCount] = useState(0);

  const form = useForm<BulkInvitationFormValues>({
    resolver: zodResolver(bulkInvitationFormSchema),
    defaultValues: {
      emails: "",
      role: "user",
      type: "account",
      message: "",
      expiresAt: "",
      institution: "",
      position: "",
    },
  });

  const bulkInvitationMutation = useMutation({
    mutationFn: async (data: BulkInvitationFormValues) => {
      const res = await apiRequest("POST", "/api/invitations/bulk", data);
      return await res.json() as BulkInvitationResult;
    },
    onSuccess: (result: BulkInvitationResult) => {
      if (result.failed === 0) {
        toast({
          title: "All invitations sent successfully",
          description: `${result.success} invitation(s) sent successfully.`,
        });
      } else {
        toast({
          title: "Bulk invitation completed with some failures",
          description: `${result.success} successful, ${result.failed} failed. Check the details below.`,
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Bulk invitation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: BulkInvitationFormValues) {
    // Prepare data for submission
    const formData = {
      ...values,
      // Convert empty string to null/undefined for the backend
      expiresAt: values.expiresAt && values.expiresAt instanceof Date ? values.expiresAt : 
                (values.expiresAt === "" ? undefined : values.expiresAt)
    };
    
    bulkInvitationMutation.mutate(formData);
  }

  // Function to parse and count emails
  const parseEmailsAndUpdateCount = (emailText: string) => {
    const emails = emailText
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setEmailCount(emails.length);
    return emails;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will send account creation invitations to multiple email addresses at once.
            Separate emails with commas, semicolons, or line breaks.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Addresses</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="user1@example.com, user2@example.com&#10;user3@example.com&#10;user4@example.com"
                  className="resize-none min-h-[120px]"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    parseEmailsAndUpdateCount(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter email addresses separated by commas, semicolons, or line breaks.
                {emailCount > 0 && (
                  <span className="block mt-1 font-medium text-blue-600">
                    <Users className="inline-block w-4 h-4 mr-1" />
                    {emailCount} email(s) detected
                  </span>
                )}
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
                  // Reset role to guest if type is attendance
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
                Add a personal note to all invitation emails.
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
                    The institution or organization (will be applied to all invitees).
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
                    <Input placeholder="Professor" {...field} />
                  </FormControl>
                  <FormDescription>
                    The position or title (will be applied to all invitees).
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
                If not specified, the invitations will expire in 14 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={bulkInvitationMutation.isPending || emailCount === 0}
        >
          {bulkInvitationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending {emailCount} invitation(s)...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send {emailCount} Invitation(s)
            </>
          )}
        </Button>

        {/* Show results of the last bulk operation */}
        {bulkInvitationMutation.data && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-2">Bulk Invitation Results:</h4>
            <div className="space-y-1 text-sm">
              <div className="text-green-600">
                ✓ {bulkInvitationMutation.data.success} invitation(s) sent successfully
              </div>
              {bulkInvitationMutation.data.failed > 0 && (
                <div className="text-red-600">
                  ✗ {bulkInvitationMutation.data.failed} invitation(s) failed
                </div>
              )}
              {bulkInvitationMutation.data.errors.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium text-red-600 mb-1">Errors:</div>
                  {bulkInvitationMutation.data.errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-600">
                      {error.email}: {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
