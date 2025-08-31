import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative w-full max-w-md"
    >
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search size={16} className="text-secondary-200" />
      </span>
      <Input placeholder="Search for products..." className="pl-10 py-5" />
    </form>
  );
};

export default SearchBar;
