import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export function useAuth() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [, setLocation] = useLocation();

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/login");
  };

  return {
    user: user || null,
    loading: isLoading,
    error: error?.message,
    isAuthenticated: !!user,
    logout,
  };
}

