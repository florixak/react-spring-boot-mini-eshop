import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";
import type { Response } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";
import { categories as dummyCategories } from "@/lib/dummyData";

const useCategories = () => {
  const {
    data: { data: categories } = { data: [] },
    isLoading,
    isError,
    refetch,
  } = useQuery<Response<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await fetchCategories();
      } catch {
        return { data: dummyCategories } as Response<Category[]>;
      }
    },
  });

  return {
    categories: categories || dummyCategories,
    isLoading,
    isError,
    refetch,
  };
};

export default useCategories;
