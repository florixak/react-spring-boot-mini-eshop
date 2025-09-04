import { Card, CardHeader, CardContent } from "./ui/card";
import ProductCard from "./ProductCard";
import { getProducts } from "@/dummyData";
import { useEffect, useState } from "react";
import type { Product } from "@/types";

const WishlistSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const wishlistItems = [...products].slice(0, 3);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const items = await getProducts({ inStockOnly: true });
      setProducts(items);
    };
    fetchWishlistItems();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary font-playfair">
            My Wishlist
          </h2>
          <p className="text-secondary-200">Items you've saved for later</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item} viewMode="list" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistSection;
