import type { Product as ProductType } from "@/types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnType } from "./ProductList";

type ProductProps = {
  productsInCategory: ProductType[];
  columns: ColumnType;
};

const Product = ({ productsInCategory, columns }: ProductProps) => {
  const table = useReactTable({
    data: productsInCategory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });
  if (productsInCategory.length === 0) {
    return null;
  }
  return (
    <div className="mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-secondary-200">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-2 px-4 text-left">
                    {flexRender(
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
                  className="py-4 px-4 text-secondary-300 italic text-center"
                >
                  No products in this category.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-secondary-100">
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

export default Product;
