import Filter from "./Filter";
import { Route } from "@/routes/index";
import Categories from "./Categories";
import { slugify } from "@/lib/utils";
import Products from "./Products";
import { Separator } from "./ui/separator";

const CategoryProducts = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleCategoryChange = (filterValue: string) => {
    navigate({ search: { ...search, filter: slugify(filterValue) } });
  };

  return (
    <section className="min-h-screen flex items-start flex-col px-4 md:px-20 lg:px-32 gap-8 py-24">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between w-full">
        <h2 className="text-primary font-playfair text-xl font-semibold">
          Shop By Category
        </h2>
        <Filter onCategoryChange={handleCategoryChange} />
      </div>
      <Categories />
      <Separator className="bg-secondary-100" />
      <Products />
    </section>
  );
};

export default CategoryProducts;
