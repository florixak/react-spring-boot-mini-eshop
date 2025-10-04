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
  state?: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
};

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

type Order = {
  id: number;
  user?: User;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  shippingMethod: ShippingMethodKey;
  shippingAddress: string;
  customerEmail: string;
  customerPhone: string;
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

type ShippingMethodKey = "STANDARD" | "EXPRESS" | "OVERNIGHT";

export type {
  Product,
  Category,
  User,
  Order,
  OrderItem,
  CartItem,
  View,
  ShippingMethodKey,
};
