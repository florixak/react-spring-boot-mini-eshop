import { slugify } from "@/lib/utils";
import Category from "./Category";
import { Route } from "@/routes";

const categories = [
  { name: "Electronics", onClick: () => console.log("Electronics clicked") },
  { name: "Books", onClick: () => console.log("Books clicked") },
  { name: "Clothing", onClick: () => console.log("Clothing clicked") },
];

const Categories = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-row items-center gap-4">
      <Category
        name="All"
        onClick={() =>
          navigate({ search: { ...search, category: slugify("all") } })
        }
        isActive={search.category === "all"}
      />
      {categories.map((cat) => (
        <Category
          key={cat.name}
          {...cat}
          isActive={search.category === slugify(cat.name)}
          onClick={() => {
            navigate({
              search: { ...search, category: slugify(cat.name) },
            });
          }}
        />
      ))}
    </div>
  );
};

export default Categories;
