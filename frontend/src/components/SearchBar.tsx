import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

const SearchBar = ({ className }: SearchBarProps) => {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={cn(`relative w-full max-w-md`, className)}
    >
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search size={16} className="text-secondary-200" />
      </span>
      <Input placeholder="Search for products..." className="pl-10 py-5" />
    </form>
  );
};

export default SearchBar;
