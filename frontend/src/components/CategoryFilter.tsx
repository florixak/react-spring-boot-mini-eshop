import type { Route } from "@/routes/shop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { categories } from "@/dummyData";

type CategoryFilterProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
};

const CategoryFilter = ({ search, navigate }: CategoryFilterProps) => {
  const handleCategoryChange = (value: string) => {
    navigate({ search: { ...search, category: value }, resetScroll: false });
  };

  return (
    <Select onValueChange={handleCategoryChange} defaultValue={search.category}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
