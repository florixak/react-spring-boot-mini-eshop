import type { Product, View } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import Button from "./Button";
import { Heart, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartState } from "@/stores/useCartStore";
import { Badge } from "./ui/badge";

type ProductCardProps = {
  product: Product;
  viewMode: View;
  onAddToCart: CartState["addToCart"];
  isInWishlist: boolean;
  toggleWishlist: (productId: number) => void;
};

const ProductCard = ({
  product,
  viewMode,
  onAddToCart,
  isInWishlist,
  toggleWishlist,
}: ProductCardProps) => {
  const isList = viewMode === "list";
  const cardClass = isList
    ? "flex flex-col md:flex-row items-stretch min-h-[180px] max-h-[200px]"
    : "flex flex-col";

  const handleAddToCart = () => {
    onAddToCart({ product, quantity: 1 });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <Card
      className={`group relative p-0 border-secondary-100 rounded-md font-playfair gap-0 ${cardClass}`}
    >
      <div
        className={` absolute top-2 right-2 z-10 p-1 rounded-full border border-secondary-200 cursor-pointer transition ${
          isInWishlist
            ? "bg-primary text-primary-foreground md:block"
            : "bg-white text-secondary-200 hover:bg-primary hover:text-primary-foreground md:hidden md:group-hover:block"
        }`}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart onClick={handleToggleWishlist} />
      </div>
      <CardHeader
        className={
          isList
            ? "w-full aspect-[4/3] md:aspect-auto md:max-w-[16rem] md:h-auto flex-shrink-0 overflow-hidden rounded-t-md md:rounded-l-md md:rounded-tr-none p-0"
            : "w-full aspect-[4/3] overflow-hidden rounded-t-md p-0"
        }
      >
        <img
          src={product.imageUrl}
          alt="Product Image"
          className={`w-full h-full md:max-h-none object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105 ${
            isList ? "md:rounded-l-md md:rounded-tr-none" : ""
          }`}
        />
      </CardHeader>

      <CardContent className="flex flex-col flex-1 justify-between px-4 pb-3">
        <Badge variant="default" className="absolute top-2 left-2">
          {product.category.title}
        </Badge>
        <div className="mb-6">
          <h2 className="text-lg text-primary font-semibold">
            {product.title}
          </h2>
          <p className="text-secondary-200 text-ellipsis overflow-hidden whitespace-normal line-clamp-2">
            {product.description}
          </p>
        </div>
        <div
          className={`flex ${
            isList ? "flex-col md:flex-row md:items-center" : "flex-col"
          } justify-between mt-4 gap-2`}
        >
          <p className="text-primary font-bold text-lg font-inter flex items-center justify-between gap-1">
            {formatPrice(product.price)}{" "}
            <span className="text-secondary-200 text-xs">
              (
              {product.stockQuantity > 0
                ? product.stockQuantity > 5
                  ? ">5 in stock"
                  : `Less than ${product.stockQuantity} in stock`
                : "Out of stock"}
              )
            </span>
          </p>
          <Button
            variant="default"
            className="border-primary bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 flex items-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
