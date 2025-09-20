import {
  fetchCurrentUser,
  login,
  logout,
  refreshToken,
  register,
} from "@/lib/api";
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
  isAdmin: () => boolean;
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
      isAdmin: () => {
        const user = get().user;
        return user?.role === "ADMIN";
      },
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
            data: { user },
          } = loginResponse;

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
          await logout();
        } catch {
          //console.error("Logout error:", error);
        } finally {
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
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
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
          await refreshToken();
          return true;
        } catch (error) {
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
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await fetchCurrentUser();

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
            state.user = user.data;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
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
