import { useEffect, useState } from "react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [, navigate] = useLocation();
  const { user, forgotPasswordMutation } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    console.log("Submitting forgot password for email:", values.email);
    setSubmittedEmail(values.email); // Store the email
    forgotPasswordMutation.mutate(values);
  };

  // Handle successful mutation separately
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess && forgotPasswordMutation.data && submittedEmail) {
      console.log("Forgot password successful, redirecting to:", `/reset-password?email=${encodeURIComponent(submittedEmail)}`);
      navigate(`/reset-password?email=${encodeURIComponent(submittedEmail)}`);
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.data, submittedEmail, navigate]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>Forgot Password | RAISE DS 2025</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a verification code to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email address" 
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
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending code...
                        </>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                    
                    {forgotPasswordMutation.isSuccess && (
                      <div className="text-center p-4 bg-green-50 rounded-md">
                        <p className="text-sm text-green-700 mb-2">
                          Code sent! Click below to enter your reset code.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/reset-password?email=${encodeURIComponent(submittedEmail)}`)}
                        >
                          Enter Reset Code
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => navigate("/auth")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="relative flex-1 hidden w-0 lg:block">
          <div className="absolute inset-0 flex flex-col justify-center p-12 bg-primary-50">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900">Password Recovery</h2>
              <p className="mt-4 text-lg text-gray-600">
                Don't worry! We'll help you get back into your RAISE DS 2025 account. Just enter your email address and we'll send you a verification code to reset your password.
              </p>
              
              <div className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Secure Process</h3>
                    <p className="mt-1 text-gray-600">
                      We use secure verification codes to ensure only you can reset your password
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mt-8">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
                    <p className="mt-1 text-gray-600">
                      If you don't receive the email, check your spam folder or contact support
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
