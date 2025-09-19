import { useUserStore } from "@/stores/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  fetchWholeWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/lib/api";
import type { Response } from "@/types/responses";
import type { Product } from "@/types";
import useObjectPaging from "./useObjectPaging";

export const useWishlist = ({
  page,
  full = false,
}: { page?: number; full?: boolean } = {}) => {
  const { user } = useUserStore();
  const { isAuthenticated } = useUserStore();
  const {
    data: wishlist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["wishlist", user?.id, page],
    queryFn: () => fetchWishlist({ page }),
    enabled: isAuthenticated,
  });

  const { data: wishlistProducts } = useQuery({
    queryKey: ["wishlist", "all", user?.id],
    queryFn: () => fetchWholeWishlist(),
    enabled: isAuthenticated && full,
  });

  const queryClient = useQueryClient();
  const { mutate: toggleWishlist } = useMutation({
    mutationFn: async (productId: number) => {
      if (isInWishlist(productId)) {
        return await removeFromWishlist(productId);
      } else {
        return await addToWishlist(productId);
      }
    },
    onMutate: (productId: number) => {
      if (isInWishlist(productId)) {
        queryClient.setQueryData(
          ["wishlist"],
          (oldData: Response<Product[]>) => {
            return {
              ...oldData,
              data: oldData.data.filter((item) => item.id !== productId),
            };
          }
        );
      } else {
        const product = wishlistProducts?.data.find((p) => p.id === productId);
        if (product) {
          queryClient.setQueryData(
            ["wishlist"],
            (oldData: Response<Product[]>) => {
              return {
                ...oldData,
                data: [...(oldData.data || []), product],
              };
            }
          );
        }
      }
    },
    onError: (error) => {
      console.error("Error toggling wishlist:", error);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const { items, currentPage, totalPages, totalItems } =
    useObjectPaging<Product>(wishlist?.data);

  const isInWishlist = (productId: number) => {
    return (
      wishlistProducts?.data.some((item) => item.id === productId) || false
    );
  };

  return {
    wishlist: items,
    wholeWishlist: wishlistProducts?.data || [],
    isInWishlist,
    toggleWishlist,
    isLoading,
    isError,
    refetch,
    currentPage,
    totalPages,
    totalItems,
  };
};
