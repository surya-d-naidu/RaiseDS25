import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, AdminRoute } from "@/lib/protected-route";
import AnimatedCursor from "@/components/ui/animated-cursor";

// Pages
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import CallForPapersPage from "@/pages/call-for-papers-page";
import ResearchAwardsPage from "@/pages/research-awards-page";
import CommitteePage from "@/pages/committee-page";
import RegisterPage from "@/pages/register-page";
import AbstractSubmissionPage from "@/pages/abstract-submission-page";
import ProfilePage from "@/pages/profile-page";
import AttendanceResponse from "@/pages/attendance-response";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminAbstracts from "@/pages/admin/abstracts";
import AdminUsers from "@/pages/admin/users";
import AdminInvitations from "@/pages/admin/invitations";
import AdminNotifications from "@/pages/admin/notifications";
import AdminCommittee from "@/pages/admin/committee";
import AdminAwards from "@/pages/admin/awards";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/call-for-papers" component={CallForPapersPage} />
      <Route path="/research-awards" component={ResearchAwardsPage} />
      <Route path="/committee" component={CommitteePage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/attendance" component={AttendanceResponse} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/abstracts/submit" component={AbstractSubmissionPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
        {/* Admin Routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />      <AdminRoute path="/admin/abstracts" component={AdminAbstracts} />
      <AdminRoute path="/admin/users" component={AdminUsers} />
      <AdminRoute path="/admin/invitations" component={AdminInvitations} />
      <AdminRoute path="/admin/notifications" component={AdminNotifications} />
      <AdminRoute path="/admin/awards" component={AdminAwards} />
      <AdminRoute path="/admin/committee" component={AdminCommittee} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AnimatedCursor />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
