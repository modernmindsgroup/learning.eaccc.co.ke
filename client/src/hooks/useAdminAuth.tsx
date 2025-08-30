import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/auth"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isAuthenticated: authData?.isAuthenticated || false,
    isLoading,
    error,
    username: authData?.username,
    role: authData?.role,
  };
}