import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2, Search } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Product } from "@/types";
import useCategories from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "@tanstack/react-router";
import { removeProduct } from "@/lib/api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("title", {
    header: "Product",
    cell: (info) => (
      <span className="font-semibold text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="font-semibold text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("stockQuantity", {
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
    cell: () => (
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

export type Column = (typeof columns)[number];

const AdminProductList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { categories } = useCategories();
  const { products } = useProducts(
    { query: debouncedSearch, size: 100 },
    "admin"
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const productsByCategory = categories.map((category) => ({
    ...category,
    products: products.filter((p) => p.category.id === category.id),
  }));

  const handleProductEdit = (productId: number) => {
    navigate({ to: `/admin/products/${productId}` });
  };

  const handleProductDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const loadingToast = toast.loading("Deleting product...");
      try {
        const response = await removeProduct(productId);
        if (response.success) {
          toast.success("Product deleted successfully", { id: loadingToast });
        } else {
          toast.error("Failed to delete product", { id: loadingToast });
        }
      } catch {
        toast.error("An error occurred", { id: loadingToast });
      }
    }
  };

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
                <tr className="bg-secondary-50 border-b border-secondary-100">
                  <td
                    colSpan={columns.length}
                    className="font-bold text-primary px-4 py-3"
                  >
                    {category.title}
                  </td>
                  <td className="py-2 px-4 text-secondary-200">
                    {category.products.length} Products
                  </td>
                </tr>
                {category.products.length === 0
                  ? null
                  : category.products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-secondary-100"
                      >
                        <td className="py-2 px-4 text-primary">
                          {product.title}
                        </td>
                        <td className="py-2 px-4">{product.description}</td>
                        <td className="py-2 px-4">
                          {product.stockQuantity > 0 ? (
                            <span>{product.stockQuantity}</span>
                          ) : (
                            <span className="text-red-500">Out of stock</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleProductEdit(product.id)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleProductDelete(product.id)}
                          >
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

export default AdminProductList;
