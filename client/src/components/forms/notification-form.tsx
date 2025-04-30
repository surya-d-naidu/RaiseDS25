import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertNotificationSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Bell } from "lucide-react";
import { Notification } from "@shared/schema";

// Create a formatted schema for the notification form
const notificationFormSchema = insertNotificationSchema.extend({
  expiresAt: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function NotificationForm({ 
  notification, 
  onSuccess 
}: { 
  notification?: Notification; 
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Format the expires date for the form if it exists
  const formatExpiresDate = (date: string | null | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: notification
      ? {
          title: notification.title,
          content: notification.content,
          type: notification.type,
          isActive: notification.isActive,
          expiresAt: formatExpiresDate(notification.expiresAt),
        }
      : {
          title: "",
          content: "",
          type: "general",
          isActive: true,
          expiresAt: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NotificationFormValues) => {
      const res = await apiRequest("POST", "/api/admin/notifications", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification created",
        description: "The notification has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Create failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: NotificationFormValues) => {
      if (!notification) throw new Error("Notification not found");
      const res = await apiRequest("PUT", `/api/admin/notifications/${notification.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification updated",
        description: "The notification has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: NotificationFormValues) {
    if (notification) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Important announcement" {...field} />
              </FormControl>
              <FormDescription>
                A short, attention-grabbing title for the notification.
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Abstract submission deadline extended to October 15, 2025"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The main message to display in the notification.
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
              <FormLabel>Notification Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Different types will be displayed with different styles.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Determines whether this notification is displayed on the site.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
                If set, the notification will automatically become inactive after this date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {notification ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              {notification ? "Update Notification" : "Create Notification"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
