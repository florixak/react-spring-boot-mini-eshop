import { useUserStore } from "@/stores/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  fetchWholeWishlist,
  removeFromWishlist,
} from "@/lib/api";
import type { Response } from "@/types/responses";
import type { Product } from "@/types";

export const useWishlist = () => {
  const { isAuthenticated } = useUserStore();
  const {
    data: wishlist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetchWholeWishlist(),
    enabled: isAuthenticated,
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
        const product = wishlist?.data.find((p) => p.id === productId);
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

  const isInWishlist = (productId: number) => {
    return wishlist?.data.some((item) => item.id === productId) || false;
  };

  return {
    wishlist: wishlist?.data || [],
    isInWishlist,
    toggleWishlist,
    isLoading,
    isError,
    refetch,
  };
};
