"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";

export default function AuthHydrator() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restore auth state from localStorage on mount
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("noren_token");
      const userStr = localStorage.getItem("noren_user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          useAuthStore.setState({ user, token });
        } catch (error) {
          console.error("Failed to restore auth state:", error);
        }
      }
    }

    setHydrated(true);
  }, []);

  return null;
}
