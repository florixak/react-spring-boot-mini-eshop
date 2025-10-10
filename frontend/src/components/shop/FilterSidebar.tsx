import type { Route } from "@/routes/shop";
import SearchBar from "../SearchBar";
import PriceFilter from "../shop/PriceFilter";
import CategoryFilter from "./CategoryFilter";
import SortFilter from "../SortFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchTheMostExpensiveProductPrice } from "@/lib/api";

type FilterSidebarProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
};

const FilterSidebar = ({ search, navigate }: FilterSidebarProps) => {
  const {
    data: maxPrice,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mostExpensivePrice", search.category],
    queryFn: fetchTheMostExpensiveProductPrice,
  });
  return (
    <aside className="p-4 border rounded-lg h-fit sticky top-20 self-start w-full lg:w-72 xl:w-80 2xl:w-96 mb-8 md:mb-0">
      <h2 className="text-primary font-bold">Filters</h2>
      <div className="flex flex-col gap-6 mt-4">
        <div>
          <span className="text-sm font-medium text-primary">
            Search for products
          </span>
          <SearchBar search={search} navigate={navigate} className="py-0" />
        </div>
        <div>
          <span className="text-sm font-medium text-primary">
            Filter by category
          </span>
          <CategoryFilter />
        </div>
        <div>
          <span className="text-sm font-medium text-primary">Sort by</span>
          <SortFilter search={search} navigate={navigate} />
        </div>
        <div>
          <span className="text-sm font-medium text-primary">
            Filter by price
          </span>
          <PriceFilter
            search={search}
            navigate={navigate}
            maxPrice={isLoading || isError ? 1000 : maxPrice || 1000}
          />
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
