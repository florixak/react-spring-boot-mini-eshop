import { fetchUsers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type UseUsersParams = {
  query?: string;
};

const useUsers = ({ query }: UseUsersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsers({ query }),
  });

  return {
    users: data?.data || [],
    isLoading,
    error,
  };
};

export default useUsers;
