import type { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Button from "./Button";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="relative border-secondary-100 rounded-md flex flex-col pt-0 font-playfair">
      <CardHeader className="object-fill p-0">
        <img
          src={product.image_url}
          alt="Product Image"
          className="w-full h-full object-cover"
        />
      </CardHeader>
      <CardContent className="flex-1 px-4">
        <h2 className="text-lg text-primary font-semibold">{product.title}</h2>
        <p className="text-secondary-200 text-ellipsis overflow-hidden whitespace-normal line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-1 flex-col items-start gap-2 px-4">
        <span className="text-primary font-bold text-lg font-inter">
          ${product.price.toFixed(2)}
        </span>
        <Button
          variant="default"
          className="border-primary bg-primary text-primary-foreground w-full rounded-sm"
        >
          <ShoppingCart />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
