import type { Category, Product } from "@/types";
import type { ProductFilter } from "./api";

export const categories: Category[] = [
  {
    id: 1,
    title: "Electronics",
    slug: "electronics",
    description: "Phones, laptops, and more.",
    enabled: true,
  },
  {
    id: 2,
    title: "Books",
    slug: "books",
    description: "Fiction, non-fiction, and educational books.",
    enabled: true,
  },
  {
    id: 3,
    title: "Clothing",
    slug: "clothing",
    description: "Men's and women's apparel.",
    enabled: true,
  },
];

export const products: Product[] = [
  {
    id: 101,
    title: "Smartphone X100",
    slug: "smartphone-x100",
    description: "A powerful smartphone with a stunning display.",
    price: 699,
    imageUrl: "https://placehold.co/600x400?text=Smartphone+X100",
    stockQuantity: 15,
    category: categories[0],
    enabled: true,
  },
  {
    id: 102,
    title: "Laptop Pro 15",
    slug: "laptop-pro-15",
    description: "A high-performance laptop for professionals.",
    price: 1299,
    imageUrl: "https://placehold.co/600x400?text=Laptop+Pro+15",
    stockQuantity: 7,
    category: categories[0],
    enabled: true,
  },
  {
    id: 201,
    title: "The Great Novel",
    slug: "the-great-novel",
    description: "A captivating story that will keep you hooked.",
    price: 19,
    imageUrl: "https://placehold.co/600x400?text=The+Great+Novel",
    stockQuantity: 30,
    category: categories[1],
    enabled: true,
  },
  {
    id: 202,
    title: "Science Textbook",
    slug: "science-textbook",
    description: "An essential textbook for science students.",
    price: 49,
    imageUrl: "https://placehold.co/600x400?text=Science+Textbook",
    stockQuantity: 12,
    category: categories[1],
    enabled: true,
  },
  {
    id: 301,
    title: "Men's T-Shirt",
    slug: "mens-tshirt",
    description: "Comfortable and stylish cotton t-shirt.",
    price: 25,
    imageUrl: "https://placehold.co/600x400?text=Men%27s+T-Shirt",
    stockQuantity: 50,
    category: categories[2],
    enabled: true,
  },
  {
    id: 302,
    title: "Women's Jeans",
    slug: "womens-jeans",
    description: "Trendy jeans for everyday wear.",
    price: 59,
    imageUrl: "https://placehold.co/600x400?text=Women%27s+Jeans",
    stockQuantity: 22,
    category: categories[2],
    enabled: true,
  },
];

export const getDummyProducts = (filter: ProductFilter): Product[] => {
  let filteredProducts = products;

  if (filter.categorySlug) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.slug === filter.categorySlug
    );
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  if (filter.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= filter.minPrice!
    );
  }

  if (filter.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= filter.maxPrice!
    );
  }

  if (filter.inStock !== undefined) {
    if (filter.inStock) {
      filteredProducts = filteredProducts.filter((p) => p.stockQuantity > 0);
    } else {
      filteredProducts = filteredProducts.filter((p) => p.stockQuantity === 0);
    }
  }

  const page = filter.page || 1;
  const size = filter.size || 9;
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  return filteredProducts.slice(startIndex, endIndex);
};
