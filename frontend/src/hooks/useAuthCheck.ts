import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

const useAuthCheck = () => {
  const { isAuthenticated, fetchUser } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser();
    }
  }, []);

  return isAuthenticated;
};

export default useAuthCheck;
