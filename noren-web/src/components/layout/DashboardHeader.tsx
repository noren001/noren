"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useState } from "react";

export default function DashboardHeader() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <div className="rounded-lg bg-linear-to-br from-blue-500 to-purple-600 p-2">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="hidden text-xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition sm:block">
            نُرن
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm text-slate-300">
          <Link href="/products" className="transition hover:text-blue-400">
            محصولات
          </Link>
          <Link href="/cart" className="transition hover:text-blue-400">
            سبد خرید
          </Link>
          <Link href="/checkout" className="transition hover:text-blue-400">
            پرداخت
          </Link>

          {/* Profile Section */}
          <div className="ml-2 flex gap-3 border-l border-slate-700 pl-2 sm:pl-6 items-center relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-full bg-linear-to-br from-blue-500 to-purple-600 p-1 hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0] || "U"}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-slate-700/50 bg-slate-800 shadow-lg backdrop-blur-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-700/50">
                  <p className="text-sm text-slate-300">خوش آمدید</p>
                  <p className="text-white font-semibold truncate">{user?.name}</p>
                </div>
                <div className="space-y-1 p-2">
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                      setShowMenu(false);
                    }}
                    className="w-full text-right px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-700/50 hover:text-blue-400 transition"
                  >
                    داشبورد
                  </button>
                  <button
                    onClick={() => {
                      router.push("/auth");
                      setShowMenu(false);
                    }}
                    className="w-full text-right px-3 py-2 rounded text-sm text-slate-300 hover:bg-slate-700/50 hover:text-blue-400 transition"
                  >
                    تغییر اطلاعات
                  </button>
                </div>
                <div className="border-t border-slate-700/50 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 rounded text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    خروج از حساب
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
