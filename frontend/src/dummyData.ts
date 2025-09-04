import type { Product, Category, OrderItem } from "@/types";
import type { PRODUCT_FILTERS } from "./constants";

export const categories: Category[] = [
  {
    id: 1,
    title: "Electronics",
    slug: "electronics",
    description: "Electronic gadgets and devices",
    enabled: true,
  },
  {
    id: 2,
    title: "Books",
    slug: "books",
    description: "Books and literature",
    enabled: true,
  },
  {
    id: 3,
    title: "Clothing",
    slug: "clothing",
    description: "Apparel and accessories",
    enabled: true,
  },
];

export const dummyProducts: Product[] = [
  {
    id: 1,
    title: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 99.99,
    image_url: "https://placehold.co/400x300?text=Headphones",
    stock_quantity: 25,
    category: categories[0],
    enabled: true,
  },
  {
    id: 2,
    title: "Smartphone",
    slug: "smartphone",
    description: "Latest model smartphone with advanced features.",
    price: 699.99,
    image_url: "https://placehold.co/400x300?text=Smartphone",
    stock_quantity: 15,
    category: categories[0],
    enabled: true,
  },
  {
    id: 3,
    title: "Classic Novel",
    slug: "classic-novel",
    description: "A timeless classic novel for your collection.",
    price: 14.99,
    image_url: "https://placehold.co/400x300?text=Book",
    stock_quantity: 50,
    category: categories[1],
    enabled: true,
  },
  {
    id: 4,
    title: "T-Shirt",
    slug: "t-shirt",
    description: "Comfortable cotton t-shirt in various sizes.",
    price: 19.99,
    image_url: "https://placehold.co/400x300?text=T-Shirt",
    stock_quantity: 100,
    category: categories[2],
    enabled: true,
  },
  {
    id: 5,
    title: "Jeans",
    slug: "jeans",
    description: "Stylish denim jeans for everyday wear.",
    price: 49.99,
    image_url: "https://placehold.co/400x300?text=Jeans",
    stock_quantity: 60,
    category: categories[2],
    enabled: true,
  },
];

type FilterOptions = {
  categorySlug?: string;
  query?: string;
  priceRange?: [number, number];
  sortBy?: (typeof PRODUCT_FILTERS)[number]["value"];
  inStockOnly?: boolean;
};

export const getProducts = async (
  filters: FilterOptions = {}
): Promise<Product[]> => {
  const {
    categorySlug,
    query,
    priceRange,
    sortBy,
    inStockOnly = false,
  } = filters;

  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...dummyProducts];

      if (categorySlug && categorySlug !== "all") {
        filtered = filtered.filter(
          (product) => product.category.slug === categorySlug
        );
      }

      if (query && query.trim()) {
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (priceRange) {
        const [minPrice, maxPrice] = priceRange;
        filtered = filtered.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
      }

      if (inStockOnly) {
        filtered = filtered.filter((product) => product.stock_quantity > 0);
      }

      if (sortBy) {
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "price_low_to_high":
              return a.price - b.price;
            case "price_high_to_low":
              return b.price - a.price;
            case "newest_arrivals":
              return b.id - a.id;
            /*case "best_rating":
              return (b.rating || 0) - (a.rating || 0);*/
            default:
              return 0;
          }
        });
      }

      resolve(filtered);
    }, 500);
  });
};

export const getCartProducts = async (productIds: number[]) => {
  return new Promise<OrderItem[]>((resolve) => {
    setTimeout(() => {
      const products: OrderItem[] = dummyProducts
        .filter((product) => productIds.includes(product.id))
        .map((product) => ({
          id: product.id,
          product,
          quantity: 1,
        }));
      resolve(products);
    }, 300);
  });
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const parsePriceRange = (priceString: string): [number, number] => {
  const [min, max] = priceString.split("-").map(Number);
  return [min || 0, max || 1000];
};
