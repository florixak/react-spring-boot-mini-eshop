import { fetchOrdersAdmin, fetchRecentOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useOrders = (params: {
  query: string;
  size: number;
  recent: boolean;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", params],
    queryFn: () =>
      params.recent
        ? fetchRecentOrders()
        : fetchOrdersAdmin({ query: params.query }),
  });

  return { orders: data?.data, isLoading, error };
};

export default useOrders;
