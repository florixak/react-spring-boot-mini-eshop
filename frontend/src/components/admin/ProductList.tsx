import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2, Search } from "lucide-react";
import { createColumnHelper, flexRender } from "@tanstack/react-table";

const categories = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Footwear" },
  { id: 3, name: "Accessories" },
];

const products = [
  { id: 1, name: "T-shirt", stock: 12, price: 25, categoryId: 1 },
  { id: 2, name: "Sneakers", stock: 5, price: 80, categoryId: 2 },
  { id: 3, name: "Backpack", stock: 0, price: 45, categoryId: 3 },
  { id: 4, name: "Jacket", stock: 3, price: 120, categoryId: 1 },
];

const columnHelper = createColumnHelper<(typeof products)[0]>();

const columns = [
  columnHelper.accessor("name", {
    header: "Product",
    cell: (info) => (
      <span className="font-semibold text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
    cell: (info) =>
      info.getValue() > 0 ? (
        <span>{info.getValue()}</span>
      ) : (
        <span className="text-red-500">Out of stock</span>
      ),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => formatPrice(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <Pencil className="size-4" />
        </Button>
        <Button size="icon" variant="destructive">
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  }),
];

const ProductList = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search]);

  // Group products by category
  const productsByCategory = categories.map((category) => ({
    ...category,
    products: filteredProducts.filter((p) => p.categoryId === category.id),
  }));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary-300" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-secondary-200">
              {columns.map((col, idx) => (
                <th key={idx} className="py-2 px-4 text-left">
                  {typeof col.header === "string" ? col.header : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productsByCategory.map((category) => (
              <Fragment key={category.id}>
                <tr>
                  <td
                    colSpan={columns.length}
                    className="bg-secondary-50 font-bold text-primary px-4 py-3 border-b border-secondary-100"
                  >
                    {category.name}
                  </td>
                </tr>
                {category.products.length === 0
                  ? null
                  : category.products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-secondary-100"
                      >
                        <td className="py-2 px-4 font-semibold text-primary">
                          {product.name}
                        </td>
                        <td className="py-2 px-4">
                          {product.stock > 0 ? (
                            <span>{product.stock}</span>
                          ) : (
                            <span className="text-red-500">Out of stock</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <Button size="icon" variant="outline">
                            <Pencil className="size-4" />
                          </Button>
                          <Button size="icon" variant="destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { Fragment } from "react";
export default ProductList;
