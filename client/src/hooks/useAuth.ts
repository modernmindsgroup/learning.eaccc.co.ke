import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

// Check if we're in development mode
const isDevelopment = import.meta.env.NODE_ENV === 'development';

export function useAuth() {
  // In development, use a static user to prevent authentication loops
  if (isDevelopment) {
    return {
      user: { 
        id: "dev-user", 
        email: "dev@example.com", 
        firstName: "Development", 
        lastName: "User" 
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
