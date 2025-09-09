import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

const useAuthCheck = () => {
  const { isAuthenticated, isLoading, user, fetchUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
  };
};

export default useAuthCheck;
