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

type FilterProps = {
  onCategoryChange: (category: string) => void;
};

const filters = [
  "Price: Low to High",
  "Price: High to Low",
  "Newest Arrivals",
  "Best Rating",
];

const Filter = ({ onCategoryChange }: FilterProps) => {
  const search = Route.useSearch();
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <Select
      onValueChange={handleCategoryChange}
      defaultValue={
        filters.find((filter) => slugify(filter) === search.filter) ||
        "no-filter"
      }
    >
      <SelectTrigger className="max-w-[200px] border-1 border-secondary-200">
        <FilterIcon />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        {filters.length === 0 ? (
          <SelectItem value="no-value" disabled>
            No Filters
          </SelectItem>
        ) : (
          <>
            <SelectItem value="no-filter" className="font-semibold">
              No Filter
            </SelectItem>
            {filters.map((item) => (
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
