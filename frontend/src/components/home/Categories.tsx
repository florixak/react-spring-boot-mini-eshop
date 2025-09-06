import { slugify } from "@/lib/utils";
import { Route } from "@/routes";
import Button from "../Button";
import { categories } from "@/dummyData";

type CategoryProductsProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
};

const Categories = ({ search, navigate }: CategoryProductsProps) => {
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
