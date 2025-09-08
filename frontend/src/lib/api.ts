import type { Category, Order, User } from "@/types";
import type {
  Response,
  CreateOrderResponse,
  LoginResponse,
  ProductPageResponse,
} from "@/types/responses";

type ProductFilter = {
  category?: string;
  sortBy?: string;
  query?: string;
  price?: string;
  stock?: string;
};

export const fetchCategories = async (): Promise<Response<Category[]>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = (await response.json()) as Response<Category[]>;
  return data;
};

export const fetchProducts = async (
  filter: ProductFilter
): Promise<Response<ProductPageResponse>> => {
  const url =
    `${import.meta.env.VITE_API_URL}/products` +
    (Object.keys(filter).length
      ? `?${new URLSearchParams(filter as Record<string, string>)}`
      : "");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = (await response.json()) as Response<ProductPageResponse>;
  console.log("fetchProducts", { data });
  return data;
};

export const fetchOrder = async (orderId: string): Promise<Response<Order>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  const data = (await response.json()) as Response<Order>;
  return data;
};

export const createOrder = async (
  orderData: Partial<Order>, // shipping address, customer email, customer phone, payment method, order items
  isLoggedIn: boolean
): Promise<Response<CreateOrderResponse>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/checkout/create-checkout-session`,
    {
      method: "POST",
      credentials: isLoggedIn ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  const data = (await response.json()) as Response<CreateOrderResponse>;
  return data;
};

export const payOrder = async (
  orderId: number
): Promise<Response<{ paymentUrl: string }>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/checkout/pay/${orderId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to initiate payment");
  }
  const data = (await response.json()) as Response<{ paymentUrl: string }>;
  return data;
};

export const cancelOrder = async (
  orderId: number,
  isLoggedIn: boolean
): Promise<Response<null>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders/cancel/${orderId}`,
    {
      method: "POST",
      credentials: isLoggedIn ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to cancel order");
  }
  const data = (await response.json()) as Response<null>;
  return data;
};

export const login = async (
  usernameOrEmail: string,
  password: string
): Promise<Response<LoginResponse>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  const data = (await response.json()) as Response<LoginResponse>;
  return data;
};

export const register = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string
): Promise<Response<{ user: User }>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to register");
  }
  const data = (await response.json()) as Response<{ user: User }>;
  return data;
};

export const refreshToken = async (): Promise<Response<LoginResponse>> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }
  const data = (await response.json()) as Response<LoginResponse>;
  return data;
};
