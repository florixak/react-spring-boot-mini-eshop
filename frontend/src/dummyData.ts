import type { Product, Category } from "@/types";

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

const dummyProducts: Product[] = [
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

export const getProducts = async (
  categoryId: Category["id"] | undefined
): Promise<Product[]> => {
  if (categoryId === undefined) {
    return Promise.resolve(dummyProducts);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        dummyProducts.filter((product) => product.category.id === categoryId)
      );
    }, 1000);
  });
};
