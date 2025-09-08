import SortFilter from "../SortFilter";
import { Route } from "@/routes/index";
import Categories from "./Categories";
import Products from "../Products";
import { Separator } from "../ui/separator";
import ViewMode from "../ViewMode";
import { useQuery } from "@tanstack/react-query";

type CategoryProductsProps = {
  title?: string;
};

const CategoryProducts = ({ title }: CategoryProductsProps) => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { category } = Route.useSearch();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoryProducts", category],
    queryFn: async () => {
      const response = await fetch(
        `/api/products?category=${category}&limit=6`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return (
    <section className="min-h-screen flex items-start flex-col px-4 md:px-20 lg:px-28 gap-8 py-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
        <h2 className="text-primary font-playfair text-xl font-semibold">
          {title}
        </h2>
        <div className="flex items-center space-x-4">
          <SortFilter search={search} navigate={navigate} />
          <ViewMode
            viewMode={search.view}
            navigate={navigate}
            search={search}
          />
        </div>
      </div>
      <Categories search={search} navigate={navigate} />
      <Separator className="bg-secondary-100" />
      <Products products={products} viewMode={search.view} />
    </section>
  );
};

export default CategoryProducts;
