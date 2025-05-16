// This file is for testing the useAuth hook exports
import { useAuth, AuthProvider } from "./hooks/use-auth";

export function TestAuth() {
  const auth = useAuth();
  return (
    <div>
      {auth.user ? `Logged in as ${auth.user.name}` : 'Not logged in'}
    </div>
  );
}

export function TestAuthWrapper({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
