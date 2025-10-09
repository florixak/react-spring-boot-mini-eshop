import { slugify } from "@/lib/utils";
import { Route } from "@/routes";

import { Skeleton } from "../ui/skeleton";
import useCategories from "@/hooks/useCategories";
import Button from "../Button";

const Categories = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { categories, isError, isLoading, refetch } = useCategories();

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {isError && (
        <div className="text-red-500">
          Failed to load categories.{" "}
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      )}
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
