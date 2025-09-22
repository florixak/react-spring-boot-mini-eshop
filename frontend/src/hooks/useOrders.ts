import { fetchOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useOrders = (params: { query: string; size: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
  });

  return { orders: data || [], isLoading, error };
};

export default useOrders;
