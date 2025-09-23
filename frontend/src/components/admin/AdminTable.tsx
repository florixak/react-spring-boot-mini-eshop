import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import { Search, AlertCircle, Loader2 } from "lucide-react";

type GlobalFilterFn<TData> = FilterFn<TData>;

const globalFilterFn: GlobalFilterFn<any> = (row, columnId, value, addMeta) => {
  const tableMeta = row.original?.__table?.options!.meta || addMeta;
  const searchableColumns = tableMeta?.searchableColumns || [];

  if (!searchableColumns.length) return true;

  const searchValue = value.toLowerCase();
  return searchableColumns.some((column: string) => {
    const cellValue = row.getValue(column);
    return cellValue?.toString().toLowerCase().includes(searchValue);
  });
};

type AdminTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  searchableColumns?: (keyof T)[];
  searchPlaceholder?: string;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
};

const AdminTable = <T,>({
  data,
  columns,
  searchableColumns = [],
  searchPlaceholder = "Search...",
  isLoading = false,
  error = null,
  emptyMessage = "No data found.",
  onRowClick,
  className = "",
}: AdminTableProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(globalFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    state: {
      globalFilter: debouncedFilter,
    },
    onGlobalFilterChange: setDebouncedFilter,
    meta: {
      searchableColumns: searchableColumns.map(String),
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-secondary-200">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        <AlertCircle className="h-6 w-6" />
        <span className="ml-2">{error}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {searchableColumns.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary-300" />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-secondary-200">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-2 px-4 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-secondary-300 italic text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-secondary-100 ${
                    onRowClick ? "hover:bg-secondary-50 cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
