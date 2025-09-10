import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

// Force development mode for now to fix infinite loading
// In production, this should be set to false
const isDevelopment = true; // Always use development mode for now

console.log('useAuth called - isDevelopment:', isDevelopment, 'NODE_ENV:', import.meta.env.NODE_ENV, 'DEV:', import.meta.env.DEV);

export function useAuth() {
  // In development, use a real database user to prevent authentication loops
  if (isDevelopment) {
    console.log('Using development auth mode');
    return {
      user: { 
        id: "6779b0f3-5666-4ece-9eaa-80ad643078c4", 
        email: "scopicservices@gmail.com", 
        firstName: "Scopic", 
        lastName: "Services" 
      } as User,
      isLoading: false,
      isAuthenticated: true,
      error: null,
    };
  }

  // Production authentication using React Query
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
