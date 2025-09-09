import type { PAYMENT_METHODS } from "@/constants";

type Category = {
  id: number;
  title: string;
  slug: string;
  description: string;
  enabled: boolean;
};

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  category: Category;
  enabled: boolean;
};

type Role = "USER" | "ADMIN";

type User = {
  id: number;
  email: string;
  phone: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  created_at: string;
};

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

type Order = {
  id: number;
  user: User;
  order_items: OrderItem[];
  total_price: number;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  payment_method: (typeof PAYMENT_METHODS)[number];
};

type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type View = "grid" | "list";

export type { Product, Category, User, Order, OrderItem, CartItem, View };
