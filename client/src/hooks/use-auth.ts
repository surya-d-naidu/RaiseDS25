import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Create a simple context for direct imports of this file
// This is only used if the .tsx version isn't used
const SimpleAuthContext = createContext<{
  user: { id: number; name: string; role?: string } | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// Helper function to create auth state - this doesn't include JSX
export const createAuthProvider = () => {
  const [user, setUser] = useState<{ id: number; name: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading the user on mount
  useEffect(() => {
    // Simulate API call to get user
    setTimeout(() => {
      setUser({ id: 1, name: "Test User", role: "user" });
      setIsLoading(false);
    }, 500);
  }, []);
  const login = () => setUser({ id: 1, name: "Test User", role: "user" });
  const logout = () => setUser(null);

  return {
    user,
    isLoading,
    login,
    logout
  };
};

// Re-export the useAuth and AuthProvider from the .tsx file
// This file is just for compatibility - the real implementation is in use-auth.tsx
export { useAuth, AuthProvider } from "./use-auth.tsx";
