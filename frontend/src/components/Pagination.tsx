import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

type PaginationProps<TSearch extends Record<string, unknown>> = {
  currentPage: number;
  totalPages: number;
  getPageSearch: (page: number) => TSearch;
  to?: string;
};

const Pagination = <TSearch extends Record<string, unknown>>({
  currentPage,
  totalPages,
  getPageSearch,
  to = ".",
}: PaginationProps<TSearch>) => {
  if (totalPages <= 1) return null;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <Button
            key={index}
            asChild
            disabled={currentPage === page}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary-100 text-secondary-foreground border-secondary-300 hover:bg-secondary-200"
            }`}
          >
            <Link
              to={to}
              search={getPageSearch(page)}
              aria-current={currentPage === page ? "page" : undefined}
              tabIndex={currentPage === page ? -1 : 0}
            >
              {page}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default Pagination;
