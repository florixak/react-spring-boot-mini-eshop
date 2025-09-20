import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "T-shirt", stock: 12, price: 25 },
  { id: 2, name: "Sneakers", stock: 5, price: 80 },
  { id: 3, name: "Backpack", stock: 0, price: 45 },
];

const ProductList = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-secondary-200">
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left">Stock</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-secondary-100">
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
              <td className="py-2 px-4">{formatPrice(product.price)}</td>
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
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
