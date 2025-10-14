import { Card, CardHeader, CardContent } from "../ui/card";
import ProductCard from "../ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartStore } from "@/stores/useCartStore";
import { HeartCrack } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

const WishlistSection = () => {
  const { isAuthenticated } = useUserStore();
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist, isInWishlist, isLoading, isError } =
    useWishlist();

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
            {!isLoading && wishlist && wishlist.length > 0 ? (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    viewMode="list"
                    onAddToCart={addToCart}
                    isInWishlist={isInWishlist(item.id)}
                    toggleWishlist={toggleWishlist}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : !isLoading && wishlist && wishlist.length === 0 ? (
              <div className="text-center text-secondary-200 py-10">
                <HeartCrack className="mx-auto mb-4 h-12 w-12 text-secondary-300" />
                You have no items in your wishlist.
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-gray-500">Loading your wishlist...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-red-500">
                  Error loading wishlist. Please try again.
                </p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistSection;
