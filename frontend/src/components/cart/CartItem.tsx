import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { CartState } from "@/stores/useCartStore";

type CartItemProps = {
  item: CartItemType;
  onIncrement: CartState["incrementItemQuantity"];
  onDecrement: CartState["decrementItemQuantity"];
  onUpdateQuantity: CartState["updateItemQuantity"];
  onRemove: (id: number) => void;
};

const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const {
    product: { title, image_url, price, stock_quantity },
    quantity,
  } = item;
  const inStock = stock_quantity > 0;
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-secondary-100 rounded-lg">
      <div className="w-full md:w-24 h-24 flex-shrink-0">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-primary text-lg">{title}</h3>
            <p className="text-md text-secondary-200">{formatPrice(price)}</p>
          </div>

          {!inStock && (
            <Badge variant="destructive" className="self-start md:self-center">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.product.id, quantity - 1)}
              disabled={!inStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                onUpdateQuantity(item.product.id, parseInt(e.target.value))
              }
              className="w-16 text-center"
              min="1"
              disabled={!inStock}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(item.product.id, quantity + 1)}
              disabled={!inStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(item.product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDecrement(item.product.id)}
          disabled={!inStock}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onUpdateQuantity(item.product.id, parseInt(e.target.value))
          }
          className="w-16 text-center"
          min="1"
          disabled={!inStock}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onIncrement(item.product.id)}
          disabled={!inStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden md:block text-right min-w-24">
        <p className="text-lg font-bold text-primary">
          {formatPrice(price * quantity)}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onRemove(item.product.id)}
        className="hidden md:flex"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
