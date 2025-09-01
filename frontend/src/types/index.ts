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
  image_url: string;
  stock_quantity: number;
  category: Category;
  enabled: boolean;
};

type Role = "USER" | "ADMIN";

type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
};

type Order = {
  id: number;
  user: User;
  items: OrderItem[];
  total: number;
};

type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type { Product, Category, User, Order, OrderItem };
