import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";
import type { Response } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  const {
    data: { data: categories } = { data: [] },
    isLoading,
    isError,
  } = useQuery<Response<Category[]>>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return {
    categories,
    isLoading,
    isError,
  };
};

export default useCategories;
