import { FilterIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { slugify } from "@/lib/utils";
import { Route } from "@/routes";
import { PRODUCT_FILTERS } from "@/constants";

type FilterProps = {
  onCategoryChange: (category: string) => void;
};

const Filter = ({ onCategoryChange }: FilterProps) => {
  const search = Route.useSearch();
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <Select
      onValueChange={handleCategoryChange}
      defaultValue={
        PRODUCT_FILTERS.find((filter) => slugify(filter) === search.filter) ||
        "no-filter"
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
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default Filter;
