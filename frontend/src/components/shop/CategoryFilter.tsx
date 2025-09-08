import { Route } from "@/routes/shop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Category } from "@/types";
import type { Response } from "@/types/responses";

import { fetchCategories } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const CategoryFilter = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const handleCategoryChange = (value: string) => {
    navigate({ search: { ...search, category: value }, resetScroll: false });
  };

  const {
    data: { data: categories } = { data: [] },
    isLoading,
    isError,
  } = useQuery<Response<Category[]>>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <Select onValueChange={handleCategoryChange} defaultValue={search.category}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
