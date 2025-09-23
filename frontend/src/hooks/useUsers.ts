import { fetchUsers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type UseUsersParams = {
  query?: string;
  size: number;
};

const useUsers = ({ query, size }: UseUsersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", { query, size }],
    queryFn: fetchUsers,
  });

  return {
    users: data?.data || [],
    isLoading,
    error,
  };
};

export default useUsers;
