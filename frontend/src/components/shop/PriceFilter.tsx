import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import type { Route } from "@/routes/shop";
import { formatPriceSimple } from "@/lib/utils";

type PriceFilterProps = {
  search: ReturnType<typeof Route.useSearch>;
  navigate: ReturnType<typeof Route.useNavigate>;
  minPrice?: number;
  maxPrice?: number;
};

const PriceFilter = ({
  search,
  navigate,
  minPrice = 0,
  maxPrice = 1000,
}: PriceFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    setPriceRange(([prevMin, prevMax]) => {
      return [Math.max(prevMin, minPrice), Math.min(prevMax, maxPrice)];
    });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        search: {
          ...search,
          price: `${priceRange[0]}-${priceRange[1]}`,
        },
        resetScroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [priceRange, navigate, search]);

  return (
    <div className="space-y-4 mt-2">
      <div className="px-2">
        <Slider
          value={priceRange}
          onValueChange={(value) =>
            setPriceRange([value[0] || 0, value[1] || maxPrice])
          }
          defaultValue={[minPrice, maxPrice]}
          max={maxPrice}
          min={minPrice}
          step={10}
          className="w-full"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatPriceSimple(priceRange[0])}</span>
        <span>{formatPriceSimple(priceRange[1])}</span>
      </div>

      <div className="flex gap-2 items-center text-sm">
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
          className="w-20 px-2 py-1 border rounded"
          min={minPrice}
          max={priceRange[1]}
        />
        <span>to</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-20 px-2 py-1 border rounded"
          min={priceRange[0]}
          max={maxPrice}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
