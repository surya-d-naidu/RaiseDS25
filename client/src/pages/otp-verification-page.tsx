import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { verifyOTPMutation, resendOTPMutation } = useAuth();
  
  // Get email from URL params - better parsing
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email");

  console.log("OTP Verification Page - Current location:", location);
  console.log("OTP Verification Page - Email from params:", email);
  console.log("OTP Verification Page - Full URL:", window.location.href);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      console.log("No email found, redirecting to auth");
      navigate("/auth");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && otp.length === 6) {
      verifyOTPMutation.mutate({ email, otp });
    }
  };

  const handleResend = () => {
    if (email && resendCooldown === 0) {
      resendOTPMutation.mutate({ email });
      setResendCooldown(60); // 1 minute cooldown
      setTimeLeft(600); // Reset timer
      setOtp(""); // Clear current OTP
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest"
                disabled={verifyOTPMutation.isPending}
                autoFocus
              />
            </div>

            {timeLeft > 0 && (
              <div className="text-center text-sm text-gray-600">
                Code expires in {formatTime(timeLeft)}
              </div>
            )}

            {timeLeft === 0 && (
              <Alert>
                <AlertDescription>
                  Your verification code has expired. Please request a new one.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={otp.length !== 6 || verifyOTPMutation.isPending || timeLeft === 0}
            >
              {verifyOTPMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify Email
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resendOTPMutation.isPending || resendCooldown > 0}
              className="w-full"
            >
              {resendOTPMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {!resendOTPMutation.isPending && <RefreshCw className="w-4 h-4 mr-2" />}
              {resendCooldown > 0 
                ? `Resend in ${formatTime(resendCooldown)}`
                : "Resend Code"
              }
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-sm"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
