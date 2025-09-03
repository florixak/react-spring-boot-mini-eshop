import { FilterIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Route } from "@/routes";
import { PRODUCT_FILTERS } from "@/constants";

type SortFilterProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
};

const SortFilter = ({ search, navigate }: SortFilterProps) => {
  const handleCategoryChange = (
    value: (typeof PRODUCT_FILTERS)[number]["value"]
  ) => {
    navigate({ search: { ...search, sortBy: value } });
  };

  return (
    <Select
      onValueChange={handleCategoryChange}
      defaultValue={
        PRODUCT_FILTERS.find((filter) => filter.value === search.sortBy)
          ?.value || "no-filter"
      }
    >
      <SelectTrigger className="max-w-[200px] border-1">
        <FilterIcon className="text-secondary-200" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        {PRODUCT_FILTERS.length === 0 ? (
          <SelectItem value="no-value" disabled>
            No Filters
          </SelectItem>
        ) : (
          <>
            <SelectItem value="no-filter">No Filter</SelectItem>
            {PRODUCT_FILTERS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default SortFilter;
