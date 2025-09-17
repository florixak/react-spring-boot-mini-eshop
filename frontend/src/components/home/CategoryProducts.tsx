import SortFilter from "../SortFilter";
import { Route } from "@/routes/index";
import Categories from "./Categories";
import Products from "../Products";
import { Separator } from "../ui/separator";
import ViewMode from "../ViewMode";
import { useProducts } from "@/hooks/useProducts";

type CategoryProductsProps = {
  title?: string;
};

const CategoryProducts = ({ title }: CategoryProductsProps) => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { products, isLoading, isError, refetch, totalPages, currentPage } =
    useProducts(search, "home");

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
      <Categories />
      <Separator className="bg-secondary-100" />
      <Products
        products={products}
        isLoading={isLoading}
        isError={isError}
        retry={refetch}
        viewMode={search.view}
        currentPage={currentPage}
        totalPages={totalPages}
        className="w-full"
        search={{
          query: "",
          price: "0-1000",
          stock: "in-stock",
          category: search.category,
          sortBy: search.sortBy,
          view: search.view,
          page: currentPage,
        }}
      />
    </section>
  );
};

export default CategoryProducts;
