import { fetchUser, fetchUsers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type UseUsersParams = {
  query?: string;
  userId?: number | undefined;
};

const useUsers = ({ query, userId }: UseUsersParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsers({ query }),
    enabled: !userId,
  });

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

  return {
    users: data?.data || [],
    user: userData?.data,
    userLoading,
    userError,
    refetchUser,
    isLoading,
    error,
    refetch,
  };
};

export default useUsers;
