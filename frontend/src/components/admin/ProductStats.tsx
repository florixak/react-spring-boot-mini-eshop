import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const ProductStats = () => {
  const totalProducts = 120;
  const lowStock = 5;

  return (
    <Card>
      <CardContent className="flex flex-col items-start py-6">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">Products</span>
        </div>
        <div className="text-3xl font-bold text-primary">{totalProducts}</div>
        <div className="text-sm text-secondary-200">{lowStock} low stock</div>
      </CardContent>
    </Card>
  );
};

export default ProductStats;
