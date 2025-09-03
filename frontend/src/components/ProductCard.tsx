import type { Product, View } from "@/types";
import { Card } from "./ui/card";
import Button from "./Button";
import { ShoppingCart } from "lucide-react";

type ProductCardProps = {
  product: Product;
  viewMode: View;
};

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  // Use flex-col for grid, flex-row for list (on md+ screens)
  const isList = viewMode === "list";
  const cardClass = isList
    ? "flex flex-col md:flex-row items-stretch min-h-[180px]"
    : "flex flex-col";

  return (
    <Card
      className={`relative p-0 border-secondary-100 rounded-md font-playfair ${cardClass}`}
    >
      <div
        className={
          isList
            ? "w-full md:max-w-[16rem] md:h-auto flex-shrink-0 overflow-hidden rounded-t-md md:rounded-l-md md:rounded-tr-none"
            : "w-full aspect-[4/3] overflow-hidden rounded-t-md"
        }
      >
        <img
          src={product.image_url}
          alt="Product Image"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col flex-1 justify-between px-4 py-3">
        <div>
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
          <span className="text-primary font-bold text-lg font-inter">
            ${product.price.toFixed(2)}
          </span>
          <Button
            variant="default"
            className="border-primary bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 flex items-center gap-2"
          >
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
