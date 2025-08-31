import Filter from "./Filter";
import { Route } from "@/routes/index";
import Categories from "./Categories";
import { slugify } from "@/lib/utils";

const CategoryProducts = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleCategoryChange = (filterValue: string) => {
    navigate({ search: { ...search, filter: slugify(filterValue) } });
  };

  return (
    <section className="min-h-screen flex items-start flex-col px-32 gap-5 py-20">
      <div className="flex flex-row items-center gap-6 justify-between w-full">
        <h2 className="text-primary font-playfair text-xl font-semibold">
          Shop By Category
        </h2>
        <Filter onCategoryChange={handleCategoryChange} />
      </div>
      <Categories />
    </section>
  );
};

export default CategoryProducts;
