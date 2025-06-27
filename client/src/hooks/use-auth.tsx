import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthResponse = SelectUser | { requiresVerification: true; email: string; message: string };
type LoginData = Pick<InsertUser, "username" | "password">;
type OTPVerificationData = { email: string; otp: string };
type ResendOTPData = { email: string };
type ForgotPasswordData = { email: string };
type ResetPasswordData = { email: string; otp: string; newPassword: string };

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<AuthResponse, Error, InsertUser>;
  verifyOTPMutation: UseMutationResult<{ user: SelectUser; verified: true }, Error, OTPVerificationData>;
  resendOTPMutation: UseMutationResult<{ message: string }, Error, ResendOTPData>;
  forgotPasswordMutation: UseMutationResult<{ message: string; email: string }, Error, ForgotPasswordData>;
  resetPasswordMutation: UseMutationResult<{ message: string }, Error, ResetPasswordData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData): Promise<AuthResponse> => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (response: AuthResponse) => {
      console.log("Login response:", response);
      if ('requiresVerification' in response) {
        // User needs email verification
        const verifyUrl = `/verify-email?email=${encodeURIComponent(response.email)}`;
        console.log("Login - User needs verification, navigating to:", verifyUrl);
        navigate(verifyUrl);
        toast({
          title: "Email verification required",
          description: response.message,
          variant: "destructive",
        });
      } else {
        // Successful login
        queryClient.setQueryData(["/api/user"], response);
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.firstName}!`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser): Promise<AuthResponse> => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (response: AuthResponse) => {
      console.log("Registration response:", response);
      if ('requiresVerification' in response) {
        // Registration successful, now needs email verification
        const verifyUrl = `/verify-email?email=${encodeURIComponent(response.email)}`;
        console.log("Navigating to:", verifyUrl);
        navigate(verifyUrl);
        toast({
          title: "Registration successful",
          description: response.message,
        });
      } else {
        // Direct login (fallback case)
        queryClient.setQueryData(["/api/user"], response);
        toast({
          title: "Registration successful",
          description: `Welcome to RAISE DS 2025, ${response.firstName}!`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: OTPVerificationData) => {
      const res = await apiRequest("POST", "/api/verify-email", data);
      return await res.json();
    },
    onSuccess: (response) => {
      if (response.user) {
        queryClient.setQueryData(["/api/user"], response.user);
        navigate("/profile");
        toast({
          title: "Email verified successfully",
          description: `Welcome to RAISE DS 2025, ${response.user.firstName}!`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: async (data: ResendOTPData) => {
      const res = await apiRequest("POST", "/api/resend-otp", data);
      return await res.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Verification code resent",
        description: response.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await apiRequest("POST", "/api/forgot-password", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return await res.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Password reset code sent",
        description: response.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      console.log("resetPasswordMutation called with:", data);
      const res = await apiRequest("POST", "/api/reset-password", data);
      console.log("API response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.log("API error response:", errorData);
        throw new Error(errorData.message || 'Password reset failed');
      }
      const result = await res.json();
      console.log("API success response:", result);
      return result;
    },
    onSuccess: (response) => {
      console.log("resetPasswordMutation success:", response);
      navigate("/auth");
      toast({
        title: "Password reset successful",
        description: response.message,
      });
    },
    onError: (error: Error) => {
      console.log("resetPasswordMutation error:", error);
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        verifyOTPMutation,
        resendOTPMutation,
        forgotPasswordMutation,
        resetPasswordMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
