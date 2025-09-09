import type { Category, Order, User } from "@/types";
import type {
  Response,
  CreateOrderResponse,
  LoginResponse,
  ProductPageResponse,
} from "@/types/responses";

type ProductFilter = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
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
  const page = 0;
  const size = 10;
  const params = new URLSearchParams();
  params.append("page", (page ?? 0).toString());
  params.append("size", (size ?? 10).toString());
  if (filter.categorySlug) params.append("categorySlug", filter.categorySlug);
  if (filter.minPrice !== undefined)
    params.append("minPrice", filter.minPrice.toString());
  if (filter.maxPrice !== undefined)
    params.append("maxPrice", filter.maxPrice.toString());
  if (filter.search) params.append("search", filter.search);
  if (filter.inStock) params.append("inStock", "true");

  const url =
    `${import.meta.env.VITE_API_URL}/products` +
    (params.toString() ? `?${params.toString()}` : "");

  const response = await fetch(url, {
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

export const fetchOrders = async (): Promise<Response<Order[]>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data = (await response.json()) as Response<Order[]>;
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
      firstName,
      lastName,
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

export const logout = async (): Promise<Response<null>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to logout");
  }
  const data = (await response.json()) as Response<null>;
  return data;
};

export const fetchCurrentUser = async (): Promise<globalThis.Response> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
