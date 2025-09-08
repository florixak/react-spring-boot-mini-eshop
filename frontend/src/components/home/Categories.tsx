import { slugify } from "@/lib/utils";
import { Route } from "@/routes";
import Button from "../Button";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";
import type { Response } from "@/types/responses";
import { Skeleton } from "../ui/skeleton";

const Categories = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    data: { data: categories } = { data: [] },
    isLoading,
    isError,
    refetch,
  } = useQuery<Response<Category[]>>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-red-500 mb-2">Error loading categories.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        onClick={() =>
          navigate({
            search: { ...search, category: slugify("all") },
            resetScroll: false,
          })
        }
        isActive={search.category === "all"}
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          isActive={search.category === slugify(cat.title)}
          onClick={() => {
            navigate({
              search: { ...search, category: slugify(cat.title) },
              resetScroll: false,
            });
          }}
        >
          {cat.title}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
