import { fetchOrdersAdmin, fetchRecentOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useOrders = (params: {
  query: string;
  size: number;
  recent: boolean;
  userId?: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", params],
    queryFn: () =>
      params.recent
        ? fetchRecentOrders()
        : fetchOrdersAdmin({
            query: params.query,
            userId: params.userId,
            size: params.size,
          }),
  });

  return { orders: data?.data, isLoading, error };
};

export default useOrders;
