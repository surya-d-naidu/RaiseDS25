import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const resetPasswordSchema = z.object({
  otp: z.string().min(1, "Verification code is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [location, navigate] = useLocation();
  const { user, resetPasswordMutation, forgotPasswordMutation } = useAuth();

  // Get email from URL parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const email = searchParams.get('email') || '';

  console.log("Reset password page - location:", location);
  console.log("Reset password page - email from URL:", email);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    console.log("Submitting reset password form:", values);
    console.log("Email from URL:", email);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    
    if (!email) {
      console.error("No email found in URL parameters");
      // Show error toast or message
      return;
    }
    
    console.log("Calling resetPasswordMutation with:", {
      email,
      otp: values.otp,
      newPassword: values.newPassword,
    });
    
    resetPasswordMutation.mutate({
      email,
      otp: values.otp,
      newPassword: values.newPassword,
    });
  };

  const handleResendCode = () => {
    if (!email) {
      return;
    }
    
    forgotPasswordMutation.mutate({ email });
  };

  // Redirect if user is already logged in, but don't redirect if no email (let user see the form)
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show warning if no email, but don't redirect
  if (!email) {
    console.warn("No email parameter found in URL");
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | RAISE DS 2025</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <Card>
              <CardHeader>
                <CardTitle>Enter Verification Code</CardTitle>
                <CardDescription>
                  We've sent a verification code to <strong>{email}</strong>. Enter the code and your new password below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter 6-digit code" 
                              {...field} 
                              maxLength={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={resetPasswordMutation.isPending}
                      onClick={(e) => {
                        console.log("Reset password button clicked");
                        console.log("Button disabled:", resetPasswordMutation.isPending);
                        console.log("Form values:", form.getValues());
                      }}
                    >
                      {resetPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleResendCode}
                        disabled={forgotPasswordMutation.isPending}
                      >
                        {forgotPasswordMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resending...
                          </>
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => navigate("/auth")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="relative flex-1 hidden w-0 lg:block">
          <div className="absolute inset-0 flex flex-col justify-center p-12 bg-primary-50">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900">Almost There!</h2>
              <p className="mt-4 text-lg text-gray-600">
                You're just one step away from regaining access to your RAISE DS 2025 account. Enter the verification code we sent to your email and choose a new secure password.
              </p>
              
              <div className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                      <path d="M3 12v6a2 2 0 002 2h14a2 2 0 002-2v-6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Secure Verification</h3>
                    <p className="mt-1 text-gray-600">
                      The code expires in 15 minutes for your security
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mt-8">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Strong Password</h3>
                    <p className="mt-1 text-gray-600">
                      Choose a password with at least 6 characters for better security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
