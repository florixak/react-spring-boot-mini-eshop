import { slugify } from "@/lib/utils";
import { Route } from "@/routes";
import Button from "./Button";
import { categories } from "@/dummyData";

const Categories = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        onClick={() =>
          navigate({ search: { ...search, category: slugify("all") } })
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
