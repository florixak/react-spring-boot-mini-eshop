import type { User } from ".";

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
  user: User;
};

type PagingObjectResponse<T> = {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  size: number;
};

export type {
  Response,
  CreateOrderResponse,
  LoginResponse,
  PagingObjectResponse,
};
