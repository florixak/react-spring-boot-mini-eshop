import { login, register } from "@/lib/api";
import type { User } from "@/types";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  clearUser: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
          state.error = null;
        }),
      clearUser: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        }),
      login: async (credentials) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const loginResponse = await login(
            credentials.emailOrUsername,
            credentials.password
          );

          const {
            data: { user, token, refreshToken },
          } = loginResponse;

          localStorage.setItem("authToken", token);
          localStorage.setItem("refreshToken", refreshToken);

          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error =
              error instanceof Error ? error.message : "Login failed";
          });
          throw error;
        }
      },
      register: async (credentials) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await register(
            credentials.username,
            credentials.password,
            credentials.email,
            credentials.firstName,
            credentials.lastName,
            credentials.phone
          );
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Registration failed";
          });
          throw error;
        } finally {
          set((state) => {
            state.isLoading = false;
          });
        }
      },
      logout: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const authToken = localStorage.getItem("authToken");
          await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ refreshToken: refreshToken }),
          });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
          });
        }
      },
      updateUser: async (updatedData) => {
        const { user } = get();
        if (!user) throw new Error("No user to update");

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify(updatedData),
            }
          );

          if (response.status === 401) {
            const refreshSuccess = await get().refreshToken?.();
            if (refreshSuccess) {
              return get().updateUser(updatedData);
            } else {
              throw new Error("Unauthorized");
            }
          }

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const updatedUser = await response.json();

          set((state) => {
            state.user = updatedUser;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error =
              error instanceof Error ? error.message : "Update failed";
          });
          throw error;
        }
      },
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const { authToken, refreshToken: newRefreshToken } =
            await response.json();
          localStorage.setItem("authToken", authToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          return true;
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");

          set((state) => {
            state.isLoading = false;
            state.error =
              error instanceof Error
                ? error.message
                : "Token refresh failed. Please login again.";
          });
          return false;
        }
      },
      fetchUser: async () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
          });
          return;
        }

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (response.status === 401) {
            const refreshSuccess = await get().refreshToken?.();
            if (refreshSuccess) {
              return get().fetchUser();
            } else {
              throw new Error("Session expired");
            }
          }

          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }

          const user = await response.json();
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");

          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error =
              error instanceof Error ? error.message : "Auth check failed";
          });
        }
      },
      clearError: () =>
        set((state) => {
          state.error = null;
        }),
    })),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
