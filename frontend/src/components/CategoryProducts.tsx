import SortFilter from "./SortFilter";
import { Route } from "@/routes/index";
import Categories from "./Categories";
import Products from "./Products";
import { Separator } from "./ui/separator";
import type { View } from "@/types";
import ViewMode from "./ViewMode";

type CategoryProductsProps = {
  title?: string;
};

const CategoryProducts = ({ title }: CategoryProductsProps) => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleViewChange = (viewValue: View) => {
    navigate({ search: { ...search, view: viewValue } });
  };

  return (
    <section className="min-h-screen flex items-start flex-col px-4 md:px-20 lg:px-28 gap-8 py-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
        <h2 className="text-primary font-playfair text-xl font-semibold">
          {title}
        </h2>
        <div className="flex items-center space-x-4">
          <SortFilter search={search} navigate={navigate} />
          <ViewMode viewMode={search.view} onViewChange={handleViewChange} />
        </div>
      </div>
      <Categories search={search} navigate={navigate} />
      <Separator className="bg-secondary-100" />
      <Products search={search} viewMode={search.view} />
    </section>
  );
};

export default CategoryProducts;
