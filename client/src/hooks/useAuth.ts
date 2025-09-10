import { useState, useEffect } from "react";
import type { User } from "@shared/schema";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });

        if (!mounted) return;

        if (response.status === 401) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();
        setUser(userData);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err as Error);
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
