import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    set({ user, token });
    if (typeof window !== "undefined") {
      localStorage.setItem("noren_token", token);
      localStorage.setItem("noren_user", JSON.stringify(user));
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("noren_token");
      localStorage.removeItem("noren_user");
    }
  },
  updateUser: (user) => set({ user }),
}));
