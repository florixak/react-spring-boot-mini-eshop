import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import type { Route } from "@/routes/shop";
import { useEffect, useState } from "react";

type SearchBarProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
  className?: string;
};

const SearchBar = ({ className, search, navigate }: SearchBarProps) => {
  const [query, setQuery] = useState<string>((search.query as string) || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate({ search: { ...search, query }, resetScroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, navigate, search]);

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={cn(`relative w-full max-w-md py-5`, className)}
    >
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search size={16} className="text-secondary-200" />
      </span>
      <Input
        placeholder="Search for products..."
        className="pl-10"
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
