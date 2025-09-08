import type { Product, User } from ".";

type Response<T> = {
  success: boolean;
  data: T;
  message: string;
};

type CreateOrderResponse = {
  checkoutUrl: string;
  orderId: number;
};

type LoginResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

type ProductPageResponse = {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  size: number;
};

export type {
  Response,
  CreateOrderResponse,
  LoginResponse,
  ProductPageResponse,
};
