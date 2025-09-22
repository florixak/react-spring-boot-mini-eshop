import type {
  Category,
  Order,
  Product,
  ShippingMethodKey,
  User,
} from "@/types";
import type {
  Response,
  CreateOrderResponse,
  LoginResponse,
  PagingObjectResponse,
} from "@/types/responses";

export type ProductFilter = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  page?: number;
  size?: number;
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

export const createCategory = async (
  title: string
): Promise<Response<Category>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/categories/admin`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description: "New Category",
        enabled: true,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add category");
  }
  const data = (await response.json()) as Response<Category>;
  return data;
};

export const fetchProducts = async (
  filter: ProductFilter
): Promise<Response<PagingObjectResponse<Product>>> => {
  const params = new URLSearchParams();
  if (filter.page !== undefined)
    params.append("page", (filter.page - 1).toString());
  if (filter.size !== undefined) params.append("size", filter.size.toString());
  else params.append("size", "6");
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

  const data = (await response.json()) as Response<
    PagingObjectResponse<Product>
  >;
  return data;
};

export const createProduct = async (productData: {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string | undefined;
}): Promise<Response<Product>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/products/admin`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...productData, enabled: true }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  const data = (await response.json()) as Response<Product>;
  return data;
};

export const fetchOrders = async ({
  page = 1,
  size = 10,
}): Promise<Response<PagingObjectResponse<Order>>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/orders?page=${page - 1}&size=${size}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data = (await response.json()) as Response<PagingObjectResponse<Order>>;
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
  orderData: {
    shippingAddress: string;
    customerEmail: string;
    customerPhone: string;
    shippingMethod: ShippingMethodKey;
    orderItems: { productId: number; quantity: number }[];
  },
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
    `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
    {
      method: "DELETE",
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

export const updateUserProfile = async (userData: {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): Promise<Response<User>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  const data = (await response.json()) as Response<User>;
  return data;
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<Response<null>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/me/password`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update user password");
  }
  const data = (await response.json()) as Response<null>;
  return data;
};

export const refreshToken = async (): Promise<Response<LoginResponse>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

export const fetchWishlist = async ({
  page = 1,
}: {
  page?: number;
}): Promise<Response<PagingObjectResponse<Product>>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/wishlist?page=${page - 1}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  const data = (await response.json()) as Response<
    PagingObjectResponse<Product>
  >;
  return data;
};

export const fetchWholeWishlist = async (): Promise<Response<Product[]>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/all`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  const data = (await response.json()) as Response<Product[]>;
  return data;
};

export const addToWishlist = async (
  productId: number
): Promise<Response<null>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/wishlist/add/${productId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add to wishlist");
  }
  const data = (await response.json()) as Response<null>;
  return data;
};

export const removeFromWishlist = async (
  productId: number
): Promise<Response<null>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/wishlist/remove/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }
  const data = (await response.json()) as Response<null>;
  return data;
};
